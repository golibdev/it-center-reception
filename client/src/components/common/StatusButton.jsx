import React from 'react'

const StatusButton = ({ icon, type, updateStatus, id, status }) => {
   return (
      <button onClick={() => updateStatus(id, status)} className={`btn btn-${type} text-white`}>
         <i className={`bi bi-${icon}`}></i>
      </button>
   )
}

export default StatusButton