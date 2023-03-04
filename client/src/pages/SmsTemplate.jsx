import { useState, useEffect } from 'react'
import PageTitle from '../components/common/PageTitle'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import Spinner from '../components/common/Spinner';
import smsTemplateApi from '../api/modules/smsTemplate.api';
import moment from 'moment'

const SmsTemplate = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [smsTemplates, setSmsTemplates] = useState([])
   const getAll = async () => {
      setIsLoading(true);
      const { response, err } = await smsTemplateApi.getAll();
      setIsLoading(false);

      if (response) {
        setSmsTemplates(response.smsTemplates)
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
                <PageTitle pageName={"Xabar shablonlari"} />
                <button 
                  className='btn btn-primary font-gilroy-medium'
                  data-bs-toggle="offcanvas" 
                  data-bs-target="#addCourseTime" 
                  aria-controls="offcanvasRight"
                >
                  Qo'shish
                </button>
                <AddSmsTemplate getAll={getAll} />
              </div>
            </div>
            <div className="card">
              <div className="card-body pt-3 pb-3">
                <SmsTemplateList smsTemplates={smsTemplates} getAll={getAll} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

const SmsTemplateList = ({ smsTemplates, getAll }) => {
  const [isRequest, setIsrequest] = useState(false)
  const deleteMessageTemplate = async (id) => {
    const isConfirm = window.confirm("Rostdan ham o'chirmoqchimisz?")

    if (isConfirm) {
      setIsrequest(true)
      const { response, err } = await smsTemplateApi.delete(id);
      setIsrequest(false)

      if (response) {
        toast.success("Muvaffaqqiyatli o'chirildi");
        await getAll();
      }

      if (err) toast.error(err.message);
    }
  }
  return (
    <div className='table-responsive'>
      <table className='table table-bordered table-hover table-striped'>
        <thead className='font-gilroy-bold'>
          <tr className='text-center'>
            <th>#</th>
            <th>Sms shablon sarlavhasi</th>
            <th>Sms shablon xabari</th>
            <th>Yaratilgan vaqti</th>
            <th>O'chirish</th>
          </tr>
        </thead>
        <tbody>
          {smsTemplates.map((item, index) => (
            <tr key={item.id} className="text-center font-gilroy-medium">
              <td>{index+1}</td>
              <td>{item.title}</td>
              <td>{item.message}</td>
              <td>
                {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
              </td>
              <td>
                <button onClick={() => {
                  deleteMessageTemplate(item.id)
                }} className='btn btn-danger'>
                  <i className='bi bi-trash-fill'></i>
                  {isRequest && <Loader/>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AddSmsTemplate = ({ getAll }) => {
  const [isRequest, setIsrequest] = useState(false);

  const addSmsTemplate = useFormik({
    initialValues: {
      title: "",
      message: ""
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(1, "Sms shablon sarlavhasi uchun kamida 1ta belgi kiriting")
        .required("Sms shablon sarlavhasini kiritish shart"),
      message: Yup.string()
        .min(1, "Sms shablon xabari uchun kamida 1ta belgi kiriting")
        .required("Sms shablon xabarini kiritish shart"),
    }),
    onSubmit: async (values) => {
      setIsrequest(true)
      const { response, err } = await smsTemplateApi.create(values);
      setIsrequest(false);
      if (response) {
        toast.success("Sms shablon muvaffaqqiyatli yaratildi");
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
          SMS Shablon yaratish
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={addSmsTemplate.handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="title" className='form-label font-gilroy-medium card-title mb-0'>
              SMS shablon sarlavhasi
            </label>
            <input 
              type="text" 
              id='title' 
              className='form-control font-gilroy-medium' 
              placeholder='Frontend guruh uchun' 
              value={addSmsTemplate.values.title} 
              onChange={addSmsTemplate.handleChange}
              name="title"
            />

            <div className="invalid-feedback" style={{ display: 'block' }}>
              {addSmsTemplate.errors.title !== undefined && addSmsTemplate.errors.title}
            </div>
          </div>

          <div className='mb-3'>
            <label htmlFor="message" className='form-label font-gilroy-medium card-title mb-0'>
              SMS shablon habari
            </label>
            <textarea className='form-control font-gilroy-medium' placeholder='Sms shablon xabari' id='message' name='message' rows={10} onChange={addSmsTemplate.handleChange}>
              {addSmsTemplate.values.message}
            </textarea>
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {addSmsTemplate.errors.message !== undefined && addSmsTemplate.errors.message}
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

export default SmsTemplate