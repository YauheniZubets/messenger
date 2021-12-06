import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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

var storage = firebase.storage();
var storageRef = storage.ref();


export var auth = firebase.auth();

export default db;

export const user = firebase.auth().currentUser;
console.log('user from fire.js: ', user);

class FireMethods {
  constructor () {
  }

  messages=[];

  submitMessage = (tweet, uid, isPicture) => {
    if (isPicture) {

    }
    db.collection("messages").add({
        data: tweet,
        timestamp: firebase.firestore.Timestamp.now(),
        userID: uid || 'message written with no ID',
        isImage : isPicture || false //маркер если картинка
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    
    return new Promise((res, rej)=>{
      var unsubscribe = db.collection("messages").orderBy("timestamp", "desc").limit(1)
      .onSnapshot((doc) => {
          doc.forEach((data) => {
              var source = data.metadata.hasPendingWrites ? "Local" : "Server";
              console.log("Snapshoted: ", data.data()['data']);
              if (source === "Local")  {
                  res(data);
              }
          });
          unsubscribe(); // убираем слушатель состояния снапшота
      });
    })
  }

  downloadMessagesFromFirestore = () => {
    //на будущее
    return db.collection("messages").orderBy("timestamp", "desc").limit(25).get().then((querySnapshot) => {
      querySnapshot.forEach((doc, index) => {
          this.messages.push(
              { 
                  'tweet': doc.data()['data'],
                  'timestamp' : doc.data()['timestamp'],
                  'userID': doc.data()['userID'],
                  'isImage' : doc.data()['isImage']
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
    
  }
  
  createImage = (url) => {
    let image = new Image();
    image.src=url;
    return image;
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

class Storage {

  uploadImage = (file, name) => {
    var imagesRef = storageRef.child(`images/${name}`);
    var uploadTask = imagesRef.put(file);
    return new Promise((res, rej)=>{
      uploadTask.on('state_changed', 
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          console.log('error: ', error);
        }, 
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            res(downloadURL);
          });
        }
      );
    })  
  }
  
}

export var StorageMethods = new Storage();