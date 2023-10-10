import db, { auth } from "./firebase";
import { FirebaseMethods } from "./firebase";

export const addNewUserToList = (userdata) => {
    db.collection('users').doc(userdata.uid).set({
        uid: userdata.uid,
        displayName: userdata.displayName,
        email: userdata.email,
        photoURL: userdata.photoURL,
    })
    .then(() => {
        console.log("User written ");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
};

export const updateUserDataInFirestore = (uid, newData, photo) => {
    db.collection('users').doc(uid).update({
        'displayName': newData.userName,
        'email': newData.email,
        'photoURL': photo
    })
    .then(() => {
        console.log("User updated ");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
};

export const usersList = async () => {
    let usersList = [];
    let result = await db.collection('users').get().then( snapshot => {
        snapshot.forEach( doc => {
            usersList.push(
                { 
                    'displayName': doc.data()['displayName'],
                    'photoURL': doc.data()['photoURL'],
                    'uid': doc.data()['uid']
                } 
            );
        });
        return usersList;
    })
    .catch(err => console.log(err));
    return result;
};

export const getLastMessageOfAllUsers = async (usersList) => {
    const mesObjRes = {};
    for (const chat of usersList) {
        const uidChat = chat['uid'];
        const lastMessage = await FirebaseMethods.downloadMessagesFromFirestore(uidChat, 1);
        mesObjRes[uidChat] = lastMessage[0]['tweet'];
    };
    return mesObjRes;
}


export const getCurrentUserData = () => {
    const user = auth.currentUser;
    if (user !== null) {
        return {
            'displayName': user.displayName,
            'email': user.email,
            'photoURL': user.photoURL
        }
    }
};

export const updateUserPhoto = (newPhoto) => {
    const user = auth.currentUser;
    user.updateProfile({
        photoURL: newPhoto
      }).then(() => {
      }).catch((error) => {
      });  
};

export const updateUserName = (newName) => {
    const user = auth.currentUser;
    user.updateProfile({
        displayName: newName
      }).then(() => {
      }).catch((error) => {
      });  
};

export const updateUserEmail = (newEmail) => {
    const user = auth.currentUser;
    user.updateEmail(newEmail).then(() => {
      }).catch((error) => {
        console.log('error: ', error);
        prompt('Для изменения почты, пожалуйста, авторизуйтесь заново и попробуйте еще раз');
      }); 
}

export const searchUser = (nameToFind) => {
    if (!nameToFind) return new Promise((res, rej) => rej(new Error('dfdf'))) ;
    const strToFind = nameToFind[0].toUpperCase() + nameToFind.slice(1);
    return new Promise(res => {
        db.collection("users").where("displayName", "==", strToFind)
        .get()
        .then( querySnapshot => querySnapshot.forEach(doc => res(doc.data())))
        .catch(error => console.log("Error getting documents: ", error));
    })
}

