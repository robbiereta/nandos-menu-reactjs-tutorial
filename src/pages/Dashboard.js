import React, { useState, useEffect } from 'react';
import { Table, Card, Image, Button, Modal, Form, FloatingLabel, Spinner } from 'react-bootstrap';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import FirestoreService from '../utils/services/FirestoreService';
import NotLoggedInView from '../components/NoLoggedInView';


function Dashboard(props) {

    const [user, setUser] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [menuCategories, setMenuCategories] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [currentMenuItem, setCurrentMenuItem] = useState({
        "folio": '',
        "tipoDeuda": '',
        "importe": 0
    });
    const [currentMenuItemId, setCurrentMenuItemId] = useState("");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    })

    function fetchMenuCategories() {
        setIsLoading(true);
        FirestoreService.getAllMenuCategories().then((response) => {
            setIsLoading(false);
            setMenuCategories(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Error occured while fetching the menu categories. " + e);
        })
    }

    function fetchMenuItems() {
        setIsLoading(true);
        FirestoreService.getAllMenuItems().then((response) => {
            setIsLoading(false);
            setMenuItems(response._delegate._snapshot.docChanges);
        }).catch((e) => {
            setIsLoading(false);
            alert("Error occured while fetching the menu item. " + e);
        })
    }

    useEffect(() => {
        if (user !== null) {
            if (menuCategories.length <= 0) {
                fetchMenuCategories();
            }
            fetchMenuItems();
        }
    }, [user])

    const [showAddEditForm, setShowAddEditForm] = useState(false);
    const [addEditFormType, setAddEditFormType] = useState('Add'); //Add, Edit
    const [validated, setValidated] = useState(false);

    const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

    const handleModalClose = () => {
        setShowAddEditForm(false);
        setShowDeleteDialogue(false);
        setCurrentMenuItemId("");
        setAddEditFormType("Add");
        setCurrentMenuItem({ "folio": '', "tipoDeuda": '', "importe": 0 })
        setIsLoading(false);
    }

    const handleAddEditFormSubmit = (e) => {
        e.preventDefault();
        const { folio, tipoDeuda, importe } = e.target.elements;

        if (importe.value && folio.value) {
            if (addEditFormType === "Add") {
                setIsLoading(true);
                FirestoreService.AddNewMenuItem(folio.value, tipoDeuda.value, importe.value).then(() => {
                
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            } else if (addEditFormType === "Edit") {
                setIsLoading(true);
                FirestoreService.UpateMenuItem(currentMenuItemId, folio.value, tipoDeuda.value, importe.value).then(() => {
                
                    handleModalClose();
                    window.location.reload(false);
                }).catch((e) => {
                    alert("Error occured: " + e.message);
                    setIsLoading(false);
                })
            }
        }
        setValidated(true)
    }

    const handleMenuItemDelete = () => {
        setIsLoading(true);
        FirestoreService.DeleteMenuItem(currentMenuItemId).then(() => {
            alert(`Deletion Successful`);
            handleModalClose();
            window.location.reload(false);
        }).catch((e) => {
            alert("Error occured: " + e.message);
            setIsLoading(false);
        })
    }
    const LogoutButtonPressed = () => {
        firebase.auth().signOut().then(() => {
            //Signout Successful
            alert("Logout Successful")
            setUser(null);
            setValidated(false);
        }).catch((e) => {
            alert(e.message);
        })
    }
    return (
        <>
            {/* <h1>You're not logged in. Please <a href="/login">login</a> first then come to dashboard.</h1> */}
            {(user === null) && <NotLoggedInView />}
            {(isLoading === true) && <Spinner animation="border" variant="secondary" />}
            {(user !== null) && <>
                {/* Add/Edit Form START */}
                <Modal show={showAddEditForm} onHide={handleModalClose}>
                    <Form noValidate validated={validated} onSubmit={handleAddEditFormSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{(addEditFormType === 'Add') ? 'Agregar' : 'Editar'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FloatingLabel controlId="folio" label="folio" className="mb-3" >
                                <Form.Control required type='text' placeholder='' size='md' value={currentMenuItem?.folio} onChange={(e) => {
                                    setCurrentMenuItem({
                                        "folio": (e.target.value) ? e.target.value : '',
                                        "tipoDeuda": currentMenuItem?.tipoDeuda,
                                        "importe": currentMenuItem?.importe
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Item name is required</Form.Control.Feedback>
                            </FloatingLabel>

                            <FloatingLabel controlId="tipoDeuda" label="Tipo de deuda" className="mb-3" >
                                <Form.Select value={currentMenuItem?.tipoDeuda} onChange={(e) => {
                                    setCurrentMenuItem({
                                        "folio": currentMenuItem?.folio,
                                        "tipoDeuda": e.target.value,
                                        "importe": currentMenuItem?.importe
                                    })
                                }}>
                                    {(menuCategories) && (menuCategories.map((menuCategory, index) => (
                                        // catNum.integerValue
                                        <option key={index} value={menuCategory.doc.data.value.mapValue.fields.catName.stringValue}>
                                            {menuCategory.doc.data.value.mapValue.fields.catName.stringValue}</option>
                                    )))}
                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel controlId="importe" label="Importe" className="mb-3">
                                <Form.Control required type='text' placeholder='' size='md' value={currentMenuItem?.importe} onChange={(e) => {
                                    setCurrentMenuItem({
                                        "folio": currentMenuItem?.folio,
                                        "tipoDeuda": currentMenuItem?.tipoDeuda,
                                        "importe": e.target.value
                                    })
                                }} />
                                <Form.Control.Feedback type='invalid'>Item Price is required</Form.Control.Feedback>
                            </FloatingLabel>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit">{(addEditFormType === 'Add') ? 'Add' : 'Update'}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                {/* Add/Edit Form END */}

                {/* Delete Confirmation Dialogue START */}
                <Modal show={showDeleteDialogue} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Borrar {currentMenuItem.folio}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Estas seguro que quieres borrar  el folio con el numero {currentMenuItem.folio}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose}>Cancelar</Button>
                        <Button variant="danger" onClick={handleMenuItemDelete}>Si, Borrar </Button>
                    </Modal.Footer>
                </Modal>
                {/* Delete Confirmation Dialogue END */}

                <Card style={{ margin: 24 }}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="align-items-center" style={{ marginRight: 8 }}>
                           
                            <h4 style={{ marginTop: 8, }}>Dashboard</h4>
                        </div>
                        <Button style={{ backgroundColor: '#000', borderWidth: 0, }} onClick={() => {
                            setShowAddEditForm(true);
                        }}>Agregar</Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Folio</th>
                                    <th>Tipo de Deuda</th>
                                    <th>Importe</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(menuItems) && (menuItems.map((menuItem, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{menuItem.doc.data.value.mapValue.fields.folio.stringValue}</td>
                                        <td>{menuItem.doc.data.value.mapValue.fields.tipoDeuda.stringValue}</td>
                                        <td>{menuItem.doc.data.value.mapValue.fields.importe.doubleValue ? menuItem.doc.data.value.mapValue.fields.importe.doubleValue : menuItem.doc.data.value.mapValue.fields.importe.integerValue}</td>
                                        <td>
                                            <Button variant='primary' onClick={() => {
                                                setCurrentMenuItemId(menuItem.doc.key.path.segments[menuItem.doc.key.path.segments.length - 1])
                                                setCurrentMenuItem({
                                                    "folio": menuItem.doc.data.value.mapValue.fields.folio.stringValue,
                                                    "tipoDeuda": menuItem.doc.data.value.mapValue.fields.tipoDeuda.stringValue,
                                                    "importe": menuItem.doc.data.value.mapValue.fields.importe.doubleValue ? menuItem.doc.data.value.mapValue.fields.importe.doubleValue : menuItem.doc.data.value.mapValue.fields.importe.integerValue
                                                });
                                                setAddEditFormType("Edit");
                                                setShowAddEditForm(true);
                                            }}>✎ Editar</Button>{' '}
                                            <Button variant='danger' onClick={() => {
                                                setCurrentMenuItemId(menuItem.doc.key.path.segments[menuItem.doc.key.path.segments.length - 1]);
                                                setCurrentMenuItem({
                                                    "folio": menuItem.doc.data.value.mapValue.fields.folio.stringValue,
                                                    "tipoDeuda": menuItem.doc.data.value.mapValue.fields.tipoDeuda.stringValue,
                                                    "importe": menuItem.doc.data.value.mapValue.fields.importe.doubleValue ? menuItem.doc.data.value.mapValue.fields.importe.doubleValue : menuItem.doc.data.value.mapValue.fields.importe.integerValue
                                                });
                                                setShowDeleteDialogue(true);
                                            }}>x Borrar</Button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                    {(user !== null) && <div style={{ margin: 0 }}>
                
                <Button variant="primary" onClick={
                    LogoutButtonPressed
                }>Salir</Button>
            </div>}
                    </Card.Footer>
                    
                </Card>
            </>}
        </>
    );
}

export default Dashboard;