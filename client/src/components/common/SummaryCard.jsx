import React from 'react'

const SummaryCard = ({ title, icon, count }) => {
   return (
      <div className="col-xxl-4 col-md-6">
         <div className="card info-card sales-card">
            <div className="card-body">
               <h5 className="card-title font-gilroy-bold">{title}</h5>
               <div className="d-flex align-items-center">
                  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                     <i className={`bi bi-${icon}`}></i>
                  </div>
                  <div className="ps-3">
                     <h6 className='font-gilroy-bold'>{ count }</h6>
                  </div>
               </div>
            </div>

         </div>
      </div>
   )
}

export default SummaryCard