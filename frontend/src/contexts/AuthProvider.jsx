import { createContext, useEffect, useState } from 'react'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';

export const AuthContext = createContext()
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    // create an account 
    const createUser = (email, password) => {
        
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // sign up with gmail 
    const signUpWithGmail = () => {
        return signInWithPopup(auth, googleProvider)
    }

    // login using email and password
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // logout 
    const logout = () => {
       return  signOut(auth)
    }

    // update profile
    const updateUserProfile = ({ name, photoURL }) => {
       return  updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
        })
    }

    // signed-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            setUser(currentuser)
            if (currentuser) {

                setLoading(false)
            }
        });
        return () => {
            return unsubscribe()
        }
    }, [])

    const authInfo = {
        user,
        createUser,
        signUpWithGmail,
        login,
        logout,
        updateUserProfile,
        loading,
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider