import React from 'react'
import { useEffect, useState } from 'react'
import { collection, getDocs, query as dbQuery, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setlastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        
        // Query object
        const qObject = dbQuery(
          listingsRef, 
          where('offer', '==', true), 
          orderBy('timestamp', 'desc'), 
          limit(10)
        )

        // Run query
        const querySnap = await getDocs(qObject);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setlastFetchedListing(lastVisible);
        const listings = [];
          
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Error occured when trying to fetch listings.')
      }
    }
    fetchListings()
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');
      
      // Query object
      const qObject = dbQuery(
        listingsRef, 
        where('offer', '==', true), 
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(3)
      )

      // Run query
      const querySnap = await getDocs(qObject);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setlastFetchedListing(lastVisible);
      const listings = [];
        
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Error occured when trying to fetch listings.')
    }
  }

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>

      {loading ? <Spinner /> 
      : listings && listings.length > 0 
      ? <>
      <main>
        <ul className="categoryListings">
          {listings.map((listing) => (
            <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
          ))}
        </ul>
      </main>
      </> 
      : <p>There are currently no offers. Please check back soon!</p>}

      <br />
      <br />

      {lastFetchedListing && (
        <p className="loadMore" onClick={onFetchMoreListings}>
          Load More
        </p>
      )}

    </div>
  )
}

export default Offers