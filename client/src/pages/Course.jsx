import { useState, useEffect } from 'react'
import PageTitle from '../components/common/PageTitle'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import Spinner from '../components/common/Spinner';
import courseApi from '../api/modules/course.api';
import moment from 'moment'

const Course = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState([])
  const getAll = async () => {
    setIsLoading(true);
    const { response, err } = await courseApi.getAll();
    setIsLoading(false);

    if (response) {
      setCourses(response)
    }
  }

  useEffect(() => {
    getAll();
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
                <PageTitle pageName={"Kurslar"} />
                <button 
                  className='btn btn-primary font-gilroy-medium'
                  data-bs-toggle="offcanvas" 
                  data-bs-target="#addCourse" 
                  aria-controls="offcanvasRight"
                >
                  Qo'shish
                </button>
                <AddCourse getAll={getAll} />
              </div>
            </div>
            <div className="card">
              <div className="card-body pt-3 pb-3">
                <CourseList getAll={getAll} courses={courses} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

const CourseList = ({ courses, getAll }) => {
  const [isRequest, setIsrequest] = useState(false);

  const updateStatus = async (id, status) => {
    setIsrequest(true)
    const { response, err } = await courseApi.updateStatus(id, status);
    setIsrequest(false);

    if (response) {
      toast.success("Muvaffaqqiyatli status o'zgartirildi")
      await getAll();
    }

    if (err) {
      toast.error(err.message);
    }
  } 
  return (
    <div className='table-responsive'>
      <table className='table table-bordered table-hover table-striped'>
        <thead className='font-gilroy-bold'>
          <tr className='text-center'>
            <th>#</th>
            <th>Kurs nomi</th>
            <th>Holati</th>
            <th>Yaratilgan vaqti</th>
            <th>Holatini o'zgartirish</th>
            <th>Tahrirlash</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((item, index) => (
            <tr key={item.id} className="text-center font-gilroy-medium">
              <td>{index+1}</td>
              <td>{item.title}</td>
              <td>
                {item.status ? "Aktiv" : "Aktiv emas"}
              </td>
              <td>
                {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
              </td>
              <td>
                {item.status ? (
                  <button onClick={() => {
                    updateStatus(item.id, !item.status)
                  }} className='btn btn-danger'>
                    <i className={`bi bi-dash-circle-fill`}></i>
                    {isRequest && <Loader/>}
                  </button>
                ) : (
                  <button onClick={() => {
                    updateStatus(item.id, !item.status)
                  }} className='btn btn-success'>
                    <i className={`bi bi-check`}></i>
                    {isRequest && <Loader/>}
                  </button>
                )}
              </td>
              <td>
                <button 
                  className='btn btn-warning text-white'
                  data-bs-toggle="offcanvas" 
                  data-bs-target={`#updateCourse${item.id}`} 
                  aria-controls="offcanvasRight"
                >
                  <i className='bi bi-pen-fill'></i>
                </button>
                <UpdateCourse getAll={getAll} item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AddCourse = ({ getAll }) => {
  const [isRequest, setIsrequest] = useState(false);

  const addCourse = useFormik({
    initialValues: {
      title: ""
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(1, "Kamida 1ta belgi kiriting")
        .required("Kurs nomini kiritish shart"),
    }),
    onSubmit: async (values) => {
      setIsrequest(true)
      const { response, err } = await courseApi.create(values);
      setIsrequest(false);
      if (response) {
        toast.success("Kurs muvaffaqqiyatli yaratildi");
        getAll();
      }

      if (err) {
        toast.error(err.message);
      }
    }
  })
  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="addCourse" aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title font-gilroy-bold" id="offcanvasRightLabel">
          Kurs qo'shish
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={addCourse.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="title" className='form-label font-gilroy-medium card-title mb-0'>
              Kurs nomi
            </label>
            <input 
              type="text" 
              id='title' 
              className='form-control font-gilroy-medium' 
              placeholder='Frontend dasturlash' 
              value={addCourse.values.title} 
              onChange={addCourse.handleChange}
              name="title"
            />

            <div className="invalid-feedback" style={{ display: 'block' }}>
              {addCourse.errors.title !== undefined && addCourse.errors.title}
            </div>
          </div>

          <button className='btn btn-primary'>
            <i className='ms-2 bi bi-plus-circle'></i>
            {isRequest && <Loader/>}
          </button>
        </form>
      </div>
    </div>
  )
}

const UpdateCourse = ({ getAll, item }) => {
  const [isRequest, setIsrequest] = useState(false);

  const addCourse = useFormik({
    initialValues: {
      title: item && item.title
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(1, "Kamida 1ta belgi kiriting")
        .required("Kurs nomini kiritish shart"),
    }),
    onSubmit: async (values) => {
      setIsrequest(true)
      const { response, err } = await courseApi.update(item.id, values);
      setIsrequest(false);
      if (response) {
        toast.success("Kurs muvaffaqqiyatli tahrirlandi");
        getAll();
      }

      if (err) {
        toast.error(err.message);
      }
    }
  })
  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id={`updateCourse${item.id}`} aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title font-gilroy-bold" id="offcanvasRightLabel">
          Kurs qo'shish
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={addCourse.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="title" className='text-start d-block form-label font-gilroy-medium card-title mb-0'>
              Kurs nomi
            </label>
            <input 
              type="text" 
              id='title' 
              className='form-control font-gilroy-medium' 
              placeholder='Frontend dasturlash' 
              value={addCourse.values.title} 
              onChange={addCourse.handleChange}
              name="title"
            />

            <div className="invalid-feedback text-start font-gilroy-medium" style={{ display: 'block' }}>
              {addCourse.errors.title !== undefined && addCourse.errors.title}
            </div>
          </div>

          <button className='btn btn-success d-block'>
            <i className={`bi bi-save-fill`}></i>
            {isRequest && <Loader/>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Course