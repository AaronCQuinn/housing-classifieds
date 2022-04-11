import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

const OAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            // Check to see if user exists.
            if (!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    username: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                });
            }
            navigate('/')
        } catch (error) {
            toast.error('Error authorizing with Google.')
        }
    }
  return (
    <div className='socialLogin'>
        <p>Sign In {location.pathname === '/sign-up' ? 'up' : 'in'} with </p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img src={googleIcon} alt="google" className='socialIconImg' />
        </button>
    </div>
  )
}

export default OAuth