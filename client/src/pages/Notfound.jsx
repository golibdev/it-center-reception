import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <div className="container">

      <section className="section error-404 min-100 d-flex flex-column align-items-center justify-content-center">
        <h1>404</h1>
        <h2>Siz qidirayotgan sahifa mavjud emas.</h2>
        <Link to={'/'} className="btn" href="index.html">Bosh sahifaga qaytish</Link>
      </section>

    </div>
  )
}

export default Notfound