import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query as dbQuery, where, orderBy, limit, startAfter, query } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setlastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        
        // Query object
        const qObject = dbQuery(
          listingsRef, 
          where('type', '==', params.categoryName), 
          orderBy('timestamp', 'desc'), 
          limit(1)
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
        console.log(error);
      }
    }
    fetchListings()
  }, [params.categoryName]);

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');
      
      // Query object
      const qObject = dbQuery(
        listingsRef, 
        where('type', '==', params.categoryName), 
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
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
          {params.categoryName === 'rent'
            ? 'Places for rent'
            : 'Places for sale'}
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

      <br />
      <br />

      {lastFetchedListing && (
        <p className="loadMore" onClick={onFetchMoreListings}>
          Load More
        </p>
      )}
      </> 
      : <p>There are currently no for {params.categoryName} listings. Please check back soon!</p>}

    </div>
  )
}

export default Category