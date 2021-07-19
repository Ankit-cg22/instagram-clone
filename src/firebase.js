// to connect react app to thr firebase platform 
// firebase->app->project settings->config->copy and paste here.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


  import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAmxBBhYk_74wz3K9KZh3PjGekZCQqg3fA",
    authDomain: "instagram-clone-cg22.firebaseapp.com",
    projectId: "instagram-clone-cg22",
    storageBucket: "instagram-clone-cg22.appspot.com",
    messagingSenderId: "772631041478",
    appId: "1:772631041478:web:579259c278b7a2b2c3cec7",
    measurementId: "G-XYYXDRWYQF"

  })

  const db=firebaseApp.firestore(); // database
  const auth=firebase.auth(); // Authentication(log in, log out) 
  const storage = firebase.storage(); // uploading stuff(images etc) to weebsite and storing in db

  export {db, auth , storage};