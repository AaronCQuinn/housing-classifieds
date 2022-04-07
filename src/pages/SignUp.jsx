import {React, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const {username, email, password} = formData;
  const navigate = useNavigate();

  const onChange = (e) => (
    setFormData((prevState) => ({
      // Spread what was previously in the object, then input the new value (or overwrite it).
      ...prevState,
      [e.target.id]: e.target.value
    }))
  )

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: username
      });

      const formDataDuplicate = {
        ...formData
      };
      delete formDataDuplicate.password;
      formDataDuplicate.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataDuplicate);

      navigate('/');
    } catch (error) {
      toast.error('An error occurred with registration.')
    }
  }

  return (
    <>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">
          Welcome back.
        </p>
      </header>

      <form onSubmit={onSubmit}>
        <input type="text" className='nameInput' placeholder='Name' id="username" value={username} onChange={onChange}/>

        <input type="email" className='emailInput' placeholder='Email' id="email" value={email} onChange={onChange}/>
        <div className='passwordInputDiv'>
          <input type={showPassword ? 'text' : 'password'} className='passwordInput' placeholder='Password' id='password' value={password} onChange={onChange}/>
          <img src={visibilityIcon} 
          alt="show password" 
          className='showPassword' 
          onClick={() => setShowPassword((prevState) => !prevState)}
          />
        </div>

        <div className='signInBar'>
          <p className="signInText">
            Sign Up
          </p>
          <button className="signInButton" type='submit'>
            <ArrowRightIcon fill='#ffffff' width='34px' height='34px' /> 
          </button>
        </div>
      </form>

      <Link to='/sign-in' className='registerLink'>
        Back
      </Link>
    </div>
    </>
  )
}

export default SignUp