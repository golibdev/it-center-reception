import { toast } from 'react-toastify';
import smsApi from '../api/modules/sms.api';

const SmsToken = () => {
   let day = localStorage.getItem('day') || 1;
   const generateDate = () => {
      localStorage.removeItem('newDate')
      let today = new Date();
      let newDate = localStorage.getItem('newDate') ? new Date(localStorage.getItem('newDate')) : new Date(today);
      newDate.setDate(today.getDate() + 25);
      const differentDay = (newDate.getTime() - today.getTime()) / 1000 / 60 / 60 / 24;
      localStorage.setItem('newDate', newDate)
      localStorage.setItem('day', differentDay)
      console.log(differentDay);
   }

   const generateToken = async () => {
      const { response, err } = await smsApi.generateToken();

      if (response) {
         localStorage.setItem('smsToken', response.data.token);
         generateDate()
      }

      if (err) toast.error(err.message)
   }

   setInterval(() => {
      day = day - 1
      localStorage.setItem('day', day);
   }, 1000 * 60 * 60 * 60 * 24)
   return (
      <div className='section'>
         <div className="row">
            <div className="col-12">
               <div style={{ overflow: "auto" }} className={`alert ${day === 0 ? 'alert-danger' : 'alert-success'}`}>
                  {day} kundan keyin tokenni yangilang
               </div>
               <button onClick={generateToken} className='btn btn-primary'>
                  Tokenni yangilash
               </button>
            </div>
         </div>
      </div>
   )
}

export default SmsToken