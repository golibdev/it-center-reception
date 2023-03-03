import React from 'react'

const Loader = () => {
   return (
      <div className="ms-2 spinner-border" role="status" style={{ width: '20px', height: '20px' }}>
         <span className="visually-hidden">Loading...</span>
      </div>
   )
}

export default Loader