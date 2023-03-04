import { Link } from 'react-router-dom'

const PageTitle = ({ pageName }) => {
   return (
      <div className="pagetitle">
         <h1 className='font-gilroy-bold m-0'>{pageName}</h1>
         <nav >
            <ol className="breadcrumb m-0">
               <li className="breadcrumb-item m-0">
                  <Link className='font-gilroy-medium' to="/">Bosh sahifa</Link>
               </li>
               <li className="m-0 breadcrumb-item active font-gilroy-bold">{pageName}</li>
            </ol>
         </nav>
      </div>
   )
}

export default PageTitle