import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import useAuth from '../../hooks/useAuth';
import adminApi from '../../api/modules/admin.api';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Spinner from '../common/Spinner';
import { setAdminData } from '../../redux/features/adminSlice';
import '../../styles/style.css'

const AppLayout = () => {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false)
   const dispatch = useDispatch();
   const token = localStorage.getItem('token');
   
   useEffect(() => {
      const getUserInfo = async () => {
         const { response, err } = await adminApi.info();
         
         if(response) {
            dispatch(setAdminData(response.admin));
            setLoading(true);
            return
         }

         if(err) {
            console.log(err);
            localStorage.removeItem('token');
            navigate('/')
         }
      }

      if(token) {
         getUserInfo();
      }
   }, [dispatch, token, navigate])


   const auth = useAuth();

   const openSidebar = () => {
      document.body.classList.toggle('toggle-sidebar')
   }

   if(auth.isAuth()) {
      return (
         <>
            <Header openSidebar={openSidebar} />
            <Sidebar openSidebar={openSidebar} />
            <main id="main" className="main">
               {loading ? <Outlet/> : (
                  <div className='d-flex align-items-center justify-content-center spinner-wrapper'>
                     <Spinner/>
                  </div>
               )}
            </main>
         </>
      )
   }

   return <Navigate to={`/`} replace />
}

export default AppLayout