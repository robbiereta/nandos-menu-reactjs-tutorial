import { firebaseApp } from '../firebase-config'
// var db= firebaseApp.database
import { getDatabase , ref, set ,onValue} from "firebase/database";
import { getAuth } from "firebase/auth";
// Initialize Realtime Database and get a reference to the service
var db = getDatabase(firebaseApp);
const auth = getAuth();

function getAllMenuItems() {
    return new Promise((resolve, reject) => {
      
        return onValue(ref(db, '/users/' ), (snapshot) => {
            const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
            // console.log(username);
          }, {
            onlyOnce: true
          });
          
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

function AddNewMenuItem(folio, tipoDeuda, importe,userId) {
    return new Promise((resolve, reject) => {
        const data = {
            "datos":{
                "nombre":"ruiz"
            },
            
            "deudas":{
                "pagado":true,
            "folio": folio,
            "tipoDeuda": tipoDeuda,
            "importe": parseFloat(importe)
            }
        }

        set(ref(db, 'empresas/' +userId), data);

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

export default { getAllMenuItems, AddNewMenuItem, UpateMenuItem, DeleteMenuItem }