import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import moment from 'moment';
import PageTitle from '../components/common/PageTitle'
import Loader from '../components/common/Loader';
import Spinner from '../components/common/Spinner';
import smsStatusApi from '../api/modules/smsStatatus.api';
import Paginate from '../components/common/Paginate';

const SmsStatus = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [data, setData] = useState([])
   const [currentPage, setCurrentPage] = useState(1);
   const [pageCount, setPageCount] = useState(0);

   const getAll = async () => {
      setIsLoading(true)
      const { response, err } = await smsStatusApi.getAll();
      setIsLoading(false);

      if (response) {
         setPageCount(Math.ceil(response.pagination.total / 10));
         setData(response.sms)
      }

      if (err) toast.error(err.message)
   }

   useEffect(() => {
      getAll()
   }, [])
   return (
      isLoading ? (
         <div className='min-100 d-flex align-items-center justify-content-center'>
            <Spinner/>
         </div>
      ): (
         <div className='section'>
            <div className="row">
               <div className="col-12">
                  <div className="card">
                     <div className="card-body pt-3 pb-3 d-flex align-items-center justify-content-between">
                        <PageTitle pageName={"Jo'natilgan xabarlar"} />
                     </div>
                  </div>
                  <div className="card">
                     <div className="card-body pt-3 pb-3">
                        <SmsStatusList getAll={getAll} data={data} currentPage={currentPage} />
                        <Paginate
                           setData={setData}
                           currentPage={currentPage}
                           setCurrentPage={setCurrentPage}
                           pageCount={pageCount}
                           type={'sms'}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   )
}

const SmsStatusList = ({ getAll, data, currentPage }) => {
   return (
      <div className='table-responsive'>
         <table style={{ width: 1500 }} className='table table-bordered table-hover table-striped'>
            <thead className='font-gilroy-bold'>
               <tr className='text-center'>
                  <th>#</th>
                  <th>SMS ID</th>
                  <th>Telefon raqam</th>
                  <th>Xabar</th>
                  <th>Yaratilgan vaqti</th>
               </tr>
            </thead>
            <tbody>
               {data.map((item, index) => (
                  <tr key={item.id} className="text-center font-gilroy-medium">
                     <td>{index+1}</td>
                     <td>{item.id}</td>
                     <td>{item.phone}</td>
                     <td>{item.message}</td>
                     <td>
                        {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}

export default SmsStatus