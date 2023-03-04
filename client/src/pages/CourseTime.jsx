import { useState, useEffect } from 'react'
import PageTitle from '../components/common/PageTitle'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import Spinner from '../components/common/Spinner';
import courseTimeApi from '../api/modules/courseTime.api';
import moment from 'moment'

const CourseTime = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [coursesTime, setCoursesTime] = useState([])
   const getAll = async () => {
      setIsLoading(true);
      const { response, err } = await courseTimeApi.getAll();
      setIsLoading(false);

      if (response) {
         setCoursesTime(response.courseTimes)
      }

      if (err) {
         toast.error(err.message)
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
                <PageTitle pageName={"Kurs vaqtlari"} />
                <button 
                  className='btn btn-primary font-gilroy-medium'
                  data-bs-toggle="offcanvas" 
                  data-bs-target="#addCourseTime" 
                  aria-controls="offcanvasRight"
                >
                  Qo'shish
                </button>
                <AddCourseTime getAll={getAll} />
              </div>
            </div>
            <div className="card">
              <div className="card-body pt-3 pb-3">
                <CourseTimeList getAll={getAll} coursesTime={coursesTime} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

const CourseTimeList = ({ coursesTime, getAll }) => {
  return (
    <div className='table-responsive'>
      <table className='table table-bordered table-hover table-striped'>
        <thead className='font-gilroy-bold'>
          <tr className='text-center'>
            <th>#</th>
            <th>Kurs vaqti</th>
            <th>Yaratilgan vaqti</th>
            <th>Tahrirlash</th>
          </tr>
        </thead>
        <tbody>
          {coursesTime.map((item, index) => (
            <tr key={item.id} className="text-center font-gilroy-medium">
              <td>{index+1}</td>
              <td>{item.title}</td>
              <td>
                {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
              </td>
              <td>
                <button 
                  className='btn btn-warning text-white'
                  data-bs-toggle="offcanvas" 
                  data-bs-target={`#updateCourseTime${item.id}`} 
                  aria-controls="offcanvasRight"
                >
                  <i className='bi bi-pen-fill'></i>
                </button>
                <UpdateCourseTime getAll={getAll} item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AddCourseTime = ({ getAll }) => {
  const [isRequest, setIsrequest] = useState(false);

  const addCourseTime = useFormik({
    initialValues: {
      title: ""
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(1, "Kamida 1ta belgi kiriting")
        .required("Kurs vaqtini kiritish shart"),
    }),
    onSubmit: async (values) => {
      setIsrequest(true)
      const { response, err } = await courseTimeApi.create(values);
      setIsrequest(false);
      if (response) {
        toast.success("Kurs vaqti muvaffaqqiyatli yaratildi");
        getAll();
      }

      if (err) {
        toast.error(err.message);
      }
    }
  })
  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="addCourseTime" aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title font-gilroy-bold" id="offcanvasRightLabel">
          Kurs vaqtini qo'shish
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={addCourseTime.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="title" className='form-label font-gilroy-medium card-title mb-0'>
              Kurs vaqti
            </label>
            <input 
              type="text" 
              id='title' 
              className='form-control font-gilroy-medium' 
              placeholder='Juft kunlari 2-smena 18:00-20:00' 
              value={addCourseTime.values.title} 
              onChange={addCourseTime.handleChange}
              name="title"
            />

            <div className="invalid-feedback" style={{ display: 'block' }}>
              {addCourseTime.errors.title !== undefined && addCourseTime.errors.title}
            </div>
          </div>

          <button className='btn btn-primary'>
            <i className='bi bi-plus-circle'></i>
            {isRequest && <Loader/>}
          </button>
        </form>
      </div>
    </div>
  )
}

const UpdateCourseTime = ({ getAll, item }) => {
  const [isRequest, setIsrequest] = useState(false);

  const addCourse = useFormik({
    initialValues: {
      title: item && item.title
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(1, "Kamida 1ta belgi kiriting")
        .required("Kurs vaqtini kiritish shart"),
    }),
    onSubmit: async (values) => {
      setIsrequest(true)
      const { response, err } = await courseTimeApi.update(item.id, values);
      setIsrequest(false);
      if (response) {
        toast.success("Kurs muvaffaqqiyatli tahrirlandi");
        getAll();
      }

      if (err) {
        console.log(err);
        toast.error(err.message);
      }
    }
  })
  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id={`updateCourseTime${item.id}`} aria-labelledby="offcanvasRightLabel">
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

export default CourseTime