const { getFirestore } = require('firebase-admin/firestore');
var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


//initialize firebase
const db = getFirestore();

module.exports = {
  db,
};