import { useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import smsStatusApi from '../../api/modules/smsStatatus.api'
import studentApi from '../../api/modules/student.api'

const Paginate = ({ setData, pageCount, setCurrentPage, currentPage, type }) => {
   const handlePageClick = (event) => {
      setCurrentPage(event.selected + 1)
   }

   const getStudents = async (currentPage) => {
      const { response, err } = await studentApi.getPagination(currentPage);

      if (response) setData(response.students);

      if (err) toast.error(err.mesage);
   }

   const getSMS = async (currentPage) => {
      const { response, err } = await smsStatusApi.getPagination(currentPage);

      if (response) setData(response.sms);

      if (err) toast.error(err.mesage);
   }


   useEffect(() => {
      switch(type) {
         case 'student': getStudents(currentPage); break;
         case 'sms': getSMS(currentPage); break;
      }
   }, [type, currentPage])
   return (
      <nav className="courses-pagination mt-50">
         <ReactPaginate 
            breakLabel="..."
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            nextLabel={<i className="bi bi-arrow-right font-weight-bold"></i>}
            previousLabel={<i className="bi bi-arrow-left font-weight-bold"></i>}
            pageCount={pageCount}
            containerClassName="pagination"
            pageClassName="page-item"
            activeClassName="active"
            activeLinkClassName='active'
            disabledClassName="disabled"
            breakClassName="page-item"
            nextClassName='page-item'
            previousClassName='page-item'
            pageLinkClassName='page-link'
            previousLinkClassName='page-link'
            nextLinkClassName='page-link'
         />
      </nav>
   )
}

export default Paginate