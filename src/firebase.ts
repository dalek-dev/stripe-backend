import * as admin from 'firebase-admin'; 

const serviceAccount = require('../firebase-admin-key.json');
const firebaseApp:admin.app.App = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://stripe-baf08.firebaseio.com"
});

export default   firebaseApp;