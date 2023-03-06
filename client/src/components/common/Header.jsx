import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';

const Header = ({ openSidebar }) => {
   const navigate = useNavigate();
   const { admin } = useSelector(state => state.admin);
   const { logout } = useAuth();
   return (
      <header id="header" className="header fixed-top d-flex align-items-center">
         <div className="d-flex align-items-center justify-content-between">
            <Link to={'/admin'} className="logo d-flex align-items-center">
               <span className="d-none d-lg-block font-gilroy-bold">Manager</span>
            </Link>
            <i onClick={openSidebar} className="bi bi-list toggle-sidebar-btn"/>
         </div>
         <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
               <li className="nav-item dropdown pe-3">
   
                  <a className="nav-link nav-profile d-flex align-items-center pe-0" href="!#" data-bs-toggle="dropdown">
                  <img src={"/assets/img/profile-img.jpg"} alt="Profile" className="rounded-circle"/>
                  <span className="d-none d-md-block dropdown-toggle ps-2 font-gilroy-medium">
                     {admin ? admin?.displayName : "Super admin"}</span>
                  </a>
   
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                     <li className="dropdown-header">
                        <h6 className='font-gilroy-medium'>{admin ? admin?.displayName : "Super admin"}</h6>
                     </li>
                     <li>
                        <hr className="dropdown-divider"/>
                     </li>
                     <li>
                        <hr className="dropdown-divider"/>
                     </li>
                     <li>
                        <p style={{ cursor: 'pointer' }} onClick={() => logout(navigate)} className="dropdown-item d-flex align-items-center m-0">
                           <i className="bi bi-box-arrow-right"/>
                           <span className='font-gilroy-medium'>Chiqish</span>
                        </p>
                     </li>
                  </ul>
               </li>
            </ul>
         </nav>
      </header>
   )
 }
 
 export default Header