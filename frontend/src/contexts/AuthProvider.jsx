import { createContext, useEffect, useReducer } from 'react'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext()
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem("user", action.payload)
            return { user: action.payload }
        case 'LOGOUT':
            localStorage.removeItem('user')
            return { user: null }
        default:
            return state
    }
}

const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, { user: null, loading:true})

     // Check if user is stored in localStorage
     useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            dispatch({ type: 'LOGIN', payload: storedUser })
        }
    }, [])

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
        return signOut(auth)
    }

    // update profile
    const updateUserProfile = ({ name, photoURL }) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
        })
    }

    // signed-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            console.log(currentUser);
            if (currentUser) {
                dispatch({ type: 'LOGIN', payload: currentUser })
            } else {
              
                dispatch({ type: 'LOGOUT' })
            }

        });
        return () => {
            return unsubscribe()
        }
    }, [])

    const authInfo = {
        user: state.user,
        createUser,
        signUpWithGmail,
        login,
        logout,
        updateUserProfile,
        loading: state.loading,
        dispatch,
    }


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider