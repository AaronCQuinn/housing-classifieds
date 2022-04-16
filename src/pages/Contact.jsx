import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config'
import { toast } from 'react-toastify'

const Contact = () => {
    const [message, setMessage] = useState('');
    const [owner, setOwner] = useState(null);
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();
    const params = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const getOwner = async () => {
            const docRef = doc(db, 'users', params.ownerId);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data());

            if (docSnap.exists()) {
                setOwner(docSnap.data());
            } else {
                toast.error('Error fetching owner data.')
            }
        }

        getOwner();
    }, [params.ownerId])

    const onChange = e => {
        setMessage(e.target.value);
    }

  return (
    <div className='pageContainer'>
        <header>
            <p className="pageHeader">
                Contact Landlord
            </p>
        </header>

        {owner !== null && (
            <main>
                <div className="contactLandlord">
                    <p className="landlordName">
                        Contact {owner?.name}
                    </p>
                </div>

                <form className="messageForm">
                    <div className="messageDiv">
                        <label htmlFor='message' className="messageLabel">Message</label>
                        <textarea name="message" id="message" className='textarea' value={message} onChange={onChange}></textarea>
                    </div>

                    <a href={`mailto:${owner.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                        <button type='button' className="primaryButton">
                            Send Message
                        </button>
                    </a>
                </form>
            </main>
        )}

        <div className='forgotPasswordLink' style={{color: 'black', marginTop: '5vh'}} onClick={() => navigate(-1)}>
            Go Back
        </div>
    </div>
  )
}

export default Contact