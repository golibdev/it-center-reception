import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';

const MainLayout = () => {
   const auth = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if(auth.isAuth()) {
         return navigate('/admin')
      }
   }, [navigate, auth])
   return (
      <main>
         <div className="container">
            <Outlet/>
         </div>
      </main>
   )
}

export default MainLayout;