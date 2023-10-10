import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyC3b4U0siOImwPIW41ose-d_HSVwmoS6t4",
    authDomain: "my-messenger-v2.firebaseapp.com",
    projectId: "my-messenger-v2",
    storageBucket: "my-messenger-v2.appspot.com",
    messagingSenderId: "32862637265",
    appId: "1:32862637265:web:6b39502307a166e14909f0"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const storage = firebase.storage();
export const storageRef = storage.ref();

export var auth = firebase.auth();

export default db;

export const user = firebase.auth().currentUser;

class FireMethods {
  
  messages=[];

  submitMessage = (tweet, uid, isPicture, nameOfTopic, userName) => {
    if (isPicture) {    }

    db.collection(nameOfTopic).add({
        data: tweet,
        timestamp: firebase.firestore.Timestamp.now(),
        userID: uid || 'message written with no ID',
        userName: userName || 'Аноним',
        isImage : isPicture || false //маркер если картинка
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    
    return new Promise((res, rej)=>{
      var unsubscribe = db.collection(nameOfTopic).orderBy("timestamp", "desc").limit(1)
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

  downloadMessagesFromFirestore = (newTopic, quan) => {
    try {
      let messages = [];
      return db.collection(newTopic).orderBy("timestamp", "desc").limit(quan || 25).get().then((querySnapshot) => {
        querySnapshot.forEach((doc, index) => {
            messages.push(
                { 
                    'tweet': doc.data()['data'],
                    'timestamp' : doc.data()['timestamp'],
                    'userID': doc.data()['userID'],
                    'userName': doc.data()['userName'],
                    'isImage' : doc.data()['isImage']
                } 
            );
        });
      })
      .then(() => messages)
      .catch(err => console.log(err));
    } catch (error) {
      console.log('error: ', error);
      
    }
    
  }

  deleteUs = () => { 
    firebase.auth().signOut().then(() => {
      console.log('user logged out');
    }).catch((error) => {
      console.log('error: ', error);
    });
  }
  
  createImage = (url) => {
    let image = new Image();
    image.src=url;
    return image;
  }

  getCurrentUser = () => {
    return new Promise((res, rej)=>{
      firebase.auth().onAuthStateChanged(user => res(user));
    }).then(result=>result)
  }

  getAllChats = () => { // хранится список всех чатов в отдельной ячейке. Ячейка создана в консоли firebase
    let arrawOfAllChats = [];
    return new Promise(res => { 
      db.collection('listOfCollections').get().then(querySnap => {
        querySnap.forEach(data => arrawOfAllChats.push(data.data().newChat));
        res(arrawOfAllChats);
      });
    });
  }

  createNewChatTopic = (newChat) => { //название нового чата записываем в ячейку firebase
    db.collection('listOfCollections').add({
        newChat: newChat
    })
  }

  getLastMessageOfAllChats = async (allChats) => {
    const mesObjRes = {};
    for (const chat of allChats) {
      const lastMessage = await this.downloadMessagesFromFirestore(chat, 1);
      mesObjRes[chat] = lastMessage[0]['tweet'];
    };
    return mesObjRes;
  }
}

export var FirebaseMethods = new FireMethods();

class Storage {

  uploadImage = (file, name) => {
    var imagesRef = storageRef.child(`images/${name}`);
    var uploadTask = imagesRef.put(file);
    console.log('uploadTask: ', uploadTask);
    return imagesRef;
    // перенести весь промис в компонент а ретурнить только аплоад таск
    return new Promise((res, rej)=>{
      uploadTask.on('state_changed', 
        (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          console.log('error: ', error);
        }, 
        () => {
          try {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                res(downloadURL);
              })
              .catch(err => console.log(err));
          } catch (error) {
            console.log('error: ', error);
          }
        }
      );
    })  
  }
  
}

export var StorageMethods = new Storage();


