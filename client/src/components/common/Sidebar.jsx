import { Link, useLocation } from "react-router-dom";
import main from "../../configs/menu.config"
import { useMediaQuery } from 'react-responsive'

const Sidebar = ({openSidebar}) => {
   const path = useLocation().pathname;

   const tablet = useMediaQuery({
      query: '(max-width: 1199.98px)'
   })
   return (
      <aside id="sidebar" className="sidebar">

         <ul className="sidebar-nav" id="sidebar-nav">
            {main.map((menu, index) => (
               <li className="nav-item" key={index}>
                  <Link onClick={tablet && openSidebar} className={`nav-link ${path !== menu.path && 'collapsed'}`} to={menu.path}>
                     <i className={menu.icon}></i>
                     <span>{menu.displayText}</span>
                  </Link>
               </li>
            ))}
         </ul>
      </aside>
   )
}

export default Sidebar