// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import firebase from "firebase/app";
import "firebase/firestore";
import { query, onSnapshot, collection, getDocs, getDoc, DocumentReference, addDoc, doc, updateDoc, arrayUnion , setDoc} from "firebase/firestore"; 
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getAuth, getRedirectResult, GoogleAuthProvider, signInWithCredential, signInWithRedirect} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { windows } from "./globals.js";
import { useEffect } from "react";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA7OB8g1kKD2ipI-to-r0FcgTZL3HC4Fs",
  authDomain: "nuart-part-2.firebaseapp.com",
  databaseURL: "https://nuart-part-2-default-rtdb.firebaseio.com",
  projectId: "nuart-part-2",
  storageBucket: "nuart-part-2.appspot.com",
  messagingSenderId: "772881649664",
  appId: "1:772881649664:web:0642ff92bfd0664f2708e5",
  measurementId: "G-2LVT1VMP6V"
  /* apiKey: "AIzaSyABH1UACr6MWu_NyW7F2Kz9UCfazSoZYms",
  authDomain: "artnu-3.firebaseapp.com",
  projectId: "artnu-3",
  storageBucket: "artnu-3.appspot.com",
  messagingSenderId: "710170288344",
  appId: "1:710170288344:web:4de13f90cfed4be94737ad",
  measurementId: "G-77RCSWTVFC" */
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
const database = getDatabase(app);

let settings = {}
if (process.env.NODE_ENV == 'production') {
  settings = {
    // Your custom settings
    experimentalForceLongPolling: true,
  };
}

export const db = initializeFirestore(app, settings)
// Initialize Cloud Firestore and get a reference to the service
//export const db = getFirestore(app);




// if (!windows.EMULATION && process.env.NODE_ENV == 'production') {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectDatabaseEmulator(database, "127.0.0.1", 9000);
//   connectFirestoreEmulator(db, "127.0.0.1", 8080);
//   signInWithCredential(auth, GoogleAuthProvider.credential(
//     '{"sub": "LHgJj7vIBfE1X7lJ1qdXRiuTm9XS", "email": "tatyanapetriv2023@u.northwestern.edu", "displayName":"tanya petriv", "email_verified": false}'
//   ));

//   // set flag to avoid connecting twice, e.g., because of an editor hot-reload
//   windows.EMULATION = true;
// }
// export async function getMessages(id) {
//   const convos = [];
//   const q = query(collection(db, "users", id, "chatrooms"));

//   const unsubscribe = onSnapshot(q, (snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       const doc = change.doc;
//       if (change.type === "added") {
//         const convo = change.doc.data();
//         convo.ref = change.doc.ref;
//         convo.id = change.doc.id;
//         convos.push(convo);
//       } 
//     });
//   });

//   return () => unsubscribe();
// }




  

    // const querySnapshot = await getDocs(collection(db, "users/"+id+"/chatrooms"));
  // querySnapshot.forEach(async (doc) => {
  // let convo = doc.data();
  // convo.ref = doc.ref;
  // convo.id = doc.id;

  //   convos.push(convo);
  // });

  // // console.log(posts);
  // return convos



// export async function getUserById(id){
//   const docRef = doc(db, "users", id);
//   const docSnap = await getDoc(docRef);
//   console.log(docSnap.data())
//   return docSnap.data();
// }
export async function getUserById(id) {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.data()) {
      return null
    }
    //console.log(docSnap.data());
    return docSnap.data();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getOrderById(orderid) {
  const orderRef = doc(db, "orders", orderid);
  const orderSnap = await getDoc(orderRef);
  if (!orderSnap.data()) {
    return null
  }
  else {
    const order = orderSnap.data();
    return order
  }
}

//get all userList
export async function getUserList(){
  var userList = []
  const userSnapshot = await getDocs(collection(db, "users"));
  userSnapshot.forEach(async (doc) => {
    let user = doc.data();
    user.id = doc.id;
    userList.push(user)
  });
  return userList
}

export const user_list = getUserList();


export async function getMessagesBetween(id, receiverID){
  var convos = []
  const querySnapshot = await getDocs(collection(db, "users/"+id+"/chatrooms"));
  querySnapshot.forEach(async (doc) => {
  let convo = doc.data();
  if (doc.id == receiverID) {
     return convo.convo;
  }

  


getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  });

  // console.log(posts);
  return convos
}
export async function addMessage(id, message, receiverID, postdata, orderid="") {
  try {
    const docRef = doc(db, "users/" + id + "/chatrooms/" + receiverID);
    const docSnap = await getDoc(docRef);
    let convo = docSnap.data()
    

    // Check if the conversation document exists
    if (docSnap.exists()) {
      // Add the message to the existing conversation
      await updateDoc(docRef, {
        convo: arrayUnion({
          sender: id,
          content: message,
          postdata: postdata,
          orderid: orderid,
        }),
      });
    } else {
      // Create a new conversation document and add the message to it
      await setDoc(docRef, {
        convo: [
          {
            sender: id,
            content: message,
            postdata: postdata,
            orderid: orderid,
          },
        ],
      });
    }

    // Mirror the message in the receiver's chatroom
    const docRef2 = doc(db, "users/" + receiverID + "/chatrooms/" + id);
    const docSnap2 = await getDoc(docRef2);

    // Check if the conversation document exists
    if (docSnap2.exists()) {
      // Add the message to the existing conversation
     //console.log("id: " + id + " receiverID: " + receiverID + " message: " + message + " postdata: " + postdata + "")
      await updateDoc(docRef2, {
        
        convo: arrayUnion({
          sender: id,
          content: message,
          postdata: postdata,
          orderid: orderid,
        }),
      }).catch((error) => {
        console.error("Error adding message: ", error);
      })
        
        ;
    } else {
      // Create a new conversation document and add the message to it
      await setDoc(docRef2, {
        convo: [
          {
            sender: id,
            content: message,
            postdata: postdata,
            orderid: orderid,
          },
        ],
      });
    }
    console.log("Message added successfully!");
  } catch (error) {
    console.error("Error adding message: ", error);
  }
}


export  async function addUser(uid, displayName, major="null", year="null", interests="null", hometown="null", pic="null") {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  const chatroomsRef = collection(userRef, "chatrooms");
// if user has never existed
  await setDoc(userRef, {
    author: displayName,
    major: major,
    year: year,
    interests: interests,
    hometown: hometown,
    pic: pic
  });
}
 
export async function addOrder(uid, recieverid, postdata, orderid) {
  try {
      const docRef = await setDoc(doc(db, "orders", orderid), {
        senderid: uid,
        reciever: recieverid,
        data: postdata
      });
    } catch (e) {
      console.error("Error adding order: ", e);
  }
}

export async function updateOrder(postdata, orderid) {
  const orderRef = doc(db, "orders", orderid);
  try {
      setDoc(orderRef, { data: postdata }, { merge: true });
    } catch (e) {
      console.error("Error updating order: ", e);
  }
}



// 

      
// export async function addMessage(id, message, receiverID) {
//   // const levID = "jrqjR6pZU3qUnEZkzjYm";
    
//   // const docRef = await addDoc(collection(db, "users/"+id+"/chatrooms")[receiverID]["convo"], 
//   // {content: message, 
//   // sender: id});
//   // Get a reference to the chatroom document
// // const chatroomRef = Firestore().collection("users/"+id+"/chatrooms").doc(receiverID);
//  const querySnapshot = await getDocs(collection(db, "users/"+id+"/chatrooms"));

//  const newMessage = {
//   sender: id,
//   content: message
// };

//  querySnapshot.forEach(async (doc) => {
//   if (doc == receiverID) {
//     doc.convos.push(newMessage)
//   }
//  }
//  )


// // Add the new message to the chatroom's messages array

// chatroomRef.update({
//   convos: firebase.firestore.FieldValue.arrayUnion(newMessage)
// })
// .then(() => {
//   console.log("New message added to chatroom.");
// })
// .catch((error) => {
//   console.error("Error adding new message to chatroom: ", error);
// });
  
// }









// // Retrieve all the documents in the chatrooms collection
// // chatroomsRef.get().then((querySnapshot) => {
// //   querySnapshot.forEach((doc) => {
// //     // Do something with each chatroom document here
// //     console.log(doc.id, ' => ', doc.data());
// //   });
// // }).catch((error) => {
// //   console.log('Error getting chatrooms:', error);
// // });

// // }

export async function readPosts(){
    var posts = []
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach(async (doc) => {
    let post = doc.data();
    post.ref = doc.ref;
    post.id = doc.id;
      posts.push(post);
    });
    // console.log(posts);
    return posts
}

export const posts_data = readPosts();
/*
export async function readCommissions(){
    var commissions = []
    const querySnapshot = await getDocs(collection(db, "commissions"));
    querySnapshot.forEach((doc) => {
      //console.log(doc.data());
      commissions.push(doc.data())
    });
    return commissions
}
export async function AddPost(price, likes, author, img, medium, caption, tags, date) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            price: price,
            likes: likes,
            author: author,
            img: img,
            medium: medium,
            caption: caption,
            tags: tags,
            date: date
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}
export async function addCommission() {
    try {
        const docRef = await addDoc(collection(db, "commissions"), {
            
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}
*/