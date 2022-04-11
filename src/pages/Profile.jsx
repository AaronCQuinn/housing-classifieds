import React, { useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    username: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const {username, email} = formData;

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== username) {
        // If not equal, update display name.
        await updateProfile(auth.currentUser, {
          displayName: username
        })

        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          username
        })
      }
    } catch (error) {
      toast.error('An error occurred while updating profile.')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }


  return (
    <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type="button" className="logOut" onClick={onLogout}>
        Logout
      </button>
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">
          Personal Details
        </p>
        <p className="changePersonalDetails" onClick={() => {
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState)
        }}>
          {changeDetails ? "done" : "change"}
        </p>
      </div>

      <div className="profileCard">
        <form action="">
          <input type="text" id="username" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={username} onChange={onChange}/>
          <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={true} value={email} onChange={onChange}/>
        </form>
      </div>

      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt="home" />
        <p>Sell or rent your property.</p>
        <img src={arrowRight} alt="arrow right" />
      </Link>
    </main>
    </div>
  )
}

export default Profile