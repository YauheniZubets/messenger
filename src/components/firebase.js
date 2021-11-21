import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyC3b4U0siOImwPIW41ose-d_HSVwmoS6t4",
    authDomain: "my-messenger-v2.firebaseapp.com",
    projectId: "my-messenger-v2",
    storageBucket: "my-messenger-v2.appspot.com",
    messagingSenderId: "32862637265",
    appId: "1:32862637265:web:6b39502307a166e14909f0"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
export var auth = firebase.auth();

export default db;

export const user = firebase.auth().currentUser;
console.log('user from fire.js: ', user);
if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
  //const displayName = user.displayName;
  // const email = user.email;
  // const photoURL = user.photoURL;
  // const emailVerified = user.emailVerified;

  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
  //const uid = user.uid;
}

// export var deleteUser = function () { //удаление пользователя
//   const user = firebase.auth().currentUser;

//   user.delete().then(() => {
//     // User deleted.
//     console.log('User deleted');
//   }).catch((error) => {
//     console.log('error: ', error);
//     // An error ocurred
//   });
// }
class FireMethods {
  constructor () {
  }

  messages=[];

  downloadMessagesFromFirestore = () => {
    //на будущее
    return db.collection("messages").orderBy("timestamp", "desc").limit(25).get().then((querySnapshot) => {
      querySnapshot.forEach((doc, index) => {
          this.messages.push(
              { 
                  'tweet': doc.data()['data'],
                  'timestamp' : doc.data()['timestamp'],
                  'userID': doc.data()['userID']
              } 
          );
      });
    })
    .then(()=>{
        return this.messages;
        //let immutableMessagesCopy=[...this.state.loadedMessages];
        //this.lastTimestamp=immutableMessagesCopy[immutableMessagesCopy.length-1]['timestamp'];
        //this.setState({loadedMessages : immutableMessagesCopy});
    });
  }

  deleteUs = () => { 
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log('user logged out');
    }).catch((error) => {
      console.log('error: ', error);
      // An error happened.
    });
    // firebase.auth().onAuthStateChanged((user) => {
    //   user.delete().then(() => {
    //     // User deleted.
    //     console.log('User deleted');
    //   }).catch((error) => {
    //     console.log('error: ', error);
    //     // An error ocurred
    //   });
    // })
  }
  

  getCurrentUser = () => {
    //let us=null;
    return new Promise((res, rej)=>{
      firebase.auth().onAuthStateChanged((user) => {
        res(user);
        if (user) {
            //let uid = user.uid;
            //let userName = user.displayName;
            //console.log('userName: ', userName);
            //let email = user.email;
        } else {
          // User is signed out
          console.log('not yet')
          // ...
        }
      });
    }).then((result)=>{
      console.log('res', result);
      //us=result;
      return result;
    })
    //return pendingUser;
  }
}

export var FirebaseMethods = new FireMethods();

