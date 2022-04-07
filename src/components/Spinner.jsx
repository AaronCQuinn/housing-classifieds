import React from 'react'
import { BarLoader } from 'react-spinners'

const Spinner = () => {
  return (
    <div className='loadingSpinnerContainer'>
        <div className="loadingSpinner">
            <BarLoader />
        </div>
    </div>
  )
}

export default Spinner