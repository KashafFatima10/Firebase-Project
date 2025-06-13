import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { signOut } from "firebase/auth"; // Import the signOut function from Firebase
// import {getMessaging} from "firebase/messaging";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyBZs3HTFOFnQf1C8p8jmFPgJr7Z-KUSpTM",
  authDomain: "book-2f85e.firebaseapp.com",
  projectId: "book-2f85e",
  storageBucket: "book-2f85e.firebasestorage.app",
  messagingSenderId: "483443214254",
  appId: "1:483443214254:web:c845fbef8063c564a0aa3f"
};


export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
// export const messaging = getMessaging(app);
// const storage = getStorage(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {
  //GPT
  const signoutUser = () => {
    signOut(firebaseAuth)
      .then(() => {
        console.log("User signed out successfully");
        setUser(null); // Update user state to null
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  const signupUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password);

  const singinUserWithEmailAndPass = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);

  const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

  const handleCreateNewListing = async (name, isbn, price) => {  //,cover
    // const imageRef = ref(storage, `uploads/images/${Date.now()}-${cover.name}`);
    // const uploadResult = await uploadBytes(imageRef, cover);
    if (!user) {
      throw new Error("User not logged in"); // or you can redirect to login
    }

    return await addDoc(collection(firestore, "books"), {
      name,
      isbn,
      price,
      // imageURL: uploadResult.ref.fullPath,
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      // photoURL: user.photoURL,
    });
  };

  const listAllBooks = () => {
    return getDocs(collection(firestore, "books"));
  };

  const getBookById = async (id) => {
    const docRef = doc(firestore, "books", id);
    const result = await getDoc(docRef);
    return result;
  };

  // const getImageURL = (path) => {
  //   return getDownloadURL(ref(storage, path));
  // };

  const placeOrder = async (bookId, qty) => {
    const collectionRef = collection(firestore, "books", bookId, "orders");
    const result = await addDoc(collectionRef, {
      userID: user.uid,
      userEmail: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      qty: Number(qty),
    });
    return result;
  };

  const fetchMyBooks = async (userId) => {
    const collectionRef = collection(firestore, "books");
    const q = query(collectionRef, where("userID", "==", userId));

    const result = await getDocs(q);
    return result;
  };

  const getOrders = async (bookId) => {
    const collectionRef = collection(firestore, "books", bookId, "orders");
    const result = await getDocs(collectionRef);
    return result;
  };

  const isLoggedIn = user ? true : false;

  return (
      <FirebaseContext.Provider
        value={{
          signinWithGoogle,
          signupUserWithEmailAndPassword,
          singinUserWithEmailAndPass,
          handleCreateNewListing,
          listAllBooks,
          // getImageURL,
          getBookById,
          placeOrder,
          fetchMyBooks,
          getOrders,
          isLoggedIn,
          user,
          signoutUser, // Add the signoutUser function here
        }}
      >
        {props.children}
      </FirebaseContext.Provider>
    );
};