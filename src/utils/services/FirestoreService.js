import { db } from '../firestore'

function getAllMenuItems() {
    return new Promise((resolve, reject) => {
        db.collection("MenuItems").get().then((allMenuItems) => {
            resolve(allMenuItems);
        }).catch((e) => {
            reject(e);
        })
    })
}

function getAllMenuCategories() {
    return new Promise((resolve, reject) => {
        db.collection("MenuCategories").get().then((allMenuCategories) => {
            resolve(allMenuCategories);
        }).catch((e) => {
            reject(e);
        })
    })
}

function AddNewMenuItem(folio, tipoDeuda, importe) {
    return new Promise((resolve, reject) => {
        const data = {
            "folio": folio,
            "tipoDeuda": tipoDeuda,
            "importe": parseFloat(importe)
        }

        db.collection("MenuItems").add(data).then((docRef) => {
            resolve(docRef);
        }).catch((e) => {
            reject(e);
        })

    })
}

function UpateMenuItem(menuItemID, folio, tipoDeuda, importe) {

    return new Promise((resolve, reject) => {

        const data = {
            "folio": folio,
            "tipoDeuda": tipoDeuda,
            "importe": parseFloat(importe)
        }

        db.collection("MenuItems").doc(menuItemID).update(data).then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

function DeleteMenuItem(menuItemID) {
    return new Promise((resolve, reject) => {
        db.collection("MenuItems").doc(menuItemID).delete().then(() => {
            resolve()
        }).catch((e) => {
            reject(e)
        })
    })
}

export default { getAllMenuItems, getAllMenuCategories, AddNewMenuItem, UpateMenuItem, DeleteMenuItem }