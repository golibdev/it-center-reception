import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import useAuth from '../../hooks/useAuth';
import adminApi from '../../api/modules/admin.api';
import smsApi from '../../api/modules/sms.api';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setAdminData } from '../../redux/features/adminSlice';
import '../../styles/style.css'
import { toast } from 'react-toastify';

const AppLayout = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const token = localStorage.getItem('token');
   const smsToken = localStorage.getItem('smsToken');
   
   useEffect(() => {
      const getUserInfo = async () => {
         const { response, err } = await adminApi.info();
         
         if(response) {
            dispatch(setAdminData(response));
            return
         }

         if(err) {
            localStorage.removeItem('token');
            navigate('/')
         }
      }

      const getSmsToken = async () => {
         const { response, err } = await smsApi.generateToken();

         if (response) localStorage.setItem('smsToken', response.data.token);
         if (err) toast.error(err.message);
      }

      if(token) {
         getUserInfo();
      }

      if (token && !smsToken) {
         getSmsToken();
      }
   }, [dispatch, token, navigate, smsToken])


   const auth = useAuth();

   const openSidebar = () => {
      document.body.classList.toggle('toggle-sidebar')
   }

   if(auth.isAuth()) {
      return (
         <>
            <Header openSidebar={openSidebar} />
            <Sidebar openSidebar={openSidebar} />
            <main id="main" className="main mb-3">
               <Outlet/>
            </main>
         </>
      )
   }

   return <Navigate to={`/`} replace />
}

export default AppLayout