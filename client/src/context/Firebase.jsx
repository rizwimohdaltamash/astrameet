import { createContext,useContext,useState,useEffect } from "react";
import {initializeApp} from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut // Add signOut function
} from 'firebase/auth';
import {getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const FirebaseContext =createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyBjvQM2FkSX1oDXkQu5CzNpVNUNRug_2zA",
    authDomain: "chatapp-a6f76.firebaseapp.com",
    projectId: "chatapp-a6f76",
    storageBucket: "chatapp-a6f76.appspot.com",
    messagingSenderId: "323797025068",
    appId: "1:323797025068:web:c167651720c47c77feac89"
  };

export const useFirebase =()=>useContext(FirebaseContext);

const firebaseApp =initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore =getFirestore(firebaseApp);

const googleProvider =new GoogleAuthProvider();

export const FirebaseProvider =(props)=>{

    const [user,setUser]=useState(null);
    
    useEffect(()=>{
    onAuthStateChanged(firebaseAuth,user =>{
        // console.log('User',user);
        if(user) setUser(user);
        else setUser(null);
    });
    },[])

    const signupUserWithEmailAndPassword =(email,password)=>
          createUserWithEmailAndPassword(firebaseAuth,email,password);
          
    const signinUserWithEmailandPass=(email,password)=>
          signInWithEmailAndPassword(firebaseAuth,email,password);

    const signinWithGoogle =()=>signInWithPopup(firebaseAuth,googleProvider); 

    const logout = () => signOut(firebaseAuth); // Add logout function
 ///   
    const saveUserDetails = async (user) => {
        if (!user) return;
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
          displayName: user.displayName,
          email: user.email,
          userId: user.uid,
          timestamp: new Date(),
        });
      };
    
      const fetchUserDetails = async (userId) => {
        const userRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userRef);
        return userDoc.exists() ? userDoc.data() : null;
      };

///
           
    const isLoggedIn = user ? true :false;
    const getDisplayName = () => (user ? user.displayName : "");//Newww

       return(
        <FirebaseContext.Provider
        value={{
             signinWithGoogle,
            signupUserWithEmailAndPassword,
            signinUserWithEmailandPass,
            isLoggedIn,
            getDisplayName,
            saveUserDetails,
            fetchUserDetails,
            logout, // Pass logout function
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
       )
}