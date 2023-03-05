import { useState, useEffect, useCallback } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import moment from 'moment'
import studentApi from '../api/modules/student.api';
import smsTemplateApi from '../api/modules/smsTemplate.api';
import smsApi from '../api/modules/sms.api';
import courseApi from '../api/modules/course.api';
import courseTimeApi from '../api/modules/courseTime.api';
import Paginate from '../components/common/Paginate';
import InputMask from 'react-input-mask';
import StatusButton from '../components/common/StatusButton';
import PageTitle from '../components/common/PageTitle'
import Loader from '../components/common/Loader';
import Spinner from '../components/common/Spinner';

const Student = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [data, setData] = useState([])
   const [currentPage, setCurrentPage] = useState(1);
   const [pageCount, setPageCount] = useState(0);
   const [courses, setCourses] = useState([]);
   const [courseTimes, setCourseTimes] = useState([]);
   const [isSearch, setIsSearch] = useState(false);
   const [searchValue, setSearchValue] = useState('');
   const [status, setStatus] = useState('');
   const [course, setCourse] = useState('');
   const [startDate, setStartDate] = useState('')
   const [endDate, setEndDate] = useState('')
   const [clickedStudents, setClickedStudents] = useState([])

   const getCourses = async () => {
      const { response, err } = await courseApi.getAll();
      if (response) setCourses(response);
      if (err) toast.error(err.message);
   }

   const getCourseTime = async () => {
      const { response, err } = await courseTimeApi.getAll();
      if (response) setCourseTimes(response.courseTimes);
      if (err) toast.error(err.message);
   }

   const getAll = async () => {
      setIsSearch(false)
      const { response, err } = await studentApi.getAll();
      setIsLoading(false);

      if (response) {
         setPageCount(Math.ceil(response.pagination.total / 10));
         setData(response.students)
      }

      if (err) toast.error(err.message);
   }

   useEffect(() => {
      getAll();
      getCourses();
      getCourseTime();
   }, [])

   const courseOptions = courses.map(item => ({
      value: item._id,
      label: item.title
   }))

   const courseTimeOptions = courseTimes.map(item => ({
      value: item._id,
      label: item.title
   }))

   const search = useCallback(async () => {
      setIsSearch(true);
      
      const { response, err } = await studentApi.search(searchValue);

      if (err) toast.error(err.message);

      if (response) setData(response.students);
   }, [searchValue])

   useEffect(() => {
      if (searchValue.trim().length !== 0) search();
      else getAll()
   }, [search, searchValue]);

   const onQueryChange = (e) => {
      const newQuery = e.target.value;
      setSearchValue(newQuery);
   }

   const getCourseFilter = useFormik({
      initialValues: {
         courseName: ""
      },
      courseName: Yup.string()
         .min(1)
         .required("Kursni tanlang"),
      onSubmit: async values => {
         if(values.courseName.length > 0) {
            setIsSearch(true)
            const { response, err } = await studentApi.getFilterCourse(values.courseName);
            
            if (response) setData(response.students)

            if (err) toast.error(err.message)
         }
      }
   })

   const getStatusFilter = async (e) => {
      e.preventDefault();

      if (status.trim().length === 0 || course.trim().length === 0) {
         toast.success('Kurs yoki status tanlanmagan');
         return;
      }

      setIsSearch(true)

      const { response, err } = await studentApi.getFilterStatus(status, course)

      if (response) setData(response.students)

      if (err) toast.error(err.message);
   }

   const getDateFilter = async (e) => {
      e.preventDefault();

      if (startDate.trim().length === 0 || endDate.trim().length === 0) {
         toast.success('Vaqt tanlanmagan');
         return;
      }

      setIsSearch(true)

      const { response, err } = await studentApi.getFilterDay(startDate, endDate)

      if (response) setData(response.students)

      if (err) toast.error(err.message);
   }

   const updatePage = () => {
      window.location.reload()
   }

   const clickedStudent = (e, id) => {
      const checked = e.target.checked
      if (checked) setClickedStudents([...clickedStudents, id])
      else {
         const filter = clickedStudents.filter(item => item !== id);
         setClickedStudents(filter)
      }
   }
   
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
                        <PageTitle pageName={"O'quvchilar"} />
                        <div>
                           <button 
                              className='btn btn-primary font-gilroy-medium me-3'
                              data-bs-toggle="offcanvas" 
                              data-bs-target="#addStudent" 
                              aria-controls="offcanvasRight"
                           >
                              Qo'shish
                           </button>
                           <AddStudent getAll={getAll} courseOptions={courseOptions} courseTimeOptions={courseTimeOptions} />

                           <button 
                              className='btn btn-success font-gilroy-medium'
                              data-bs-toggle="offcanvas"
                              data-bs-target="#sendMessageall"
                              aria-controls="offcanvasRight"
                           >
                              <i className='bi bi-envelope-check-fill'></i>
                           </button>
                           <SendSms type={'all'} students={clickedStudents} />
                        </div>
                     </div>
                  </div>
                  <div className="card">
                     <div className="card-header d-flex flex-column">
                        <div className='col-12 mb-3'>
                           <button className="btn btn-primary font-gilroy-bold w-100" type="button" data-bs-toggle="collapse" data-bs-target="#status">
                              Status va kurs bo'yicha filterlash
                           </button>
                           <div className="collapse py-3" id="status">
                              <form className='row' onSubmit={getStatusFilter}>
                                 <div className='col-lg-6 col-12'>
                                    <label htmlFor="statusText" className='font-gilroy-bold text-dark form-label'>Holat</label>
                                    <select value={status} onChange={e => setStatus(e.target.value)} name="statusText" id="statusText" className='form-control font-gilroy-medium'>
                                       <option value="">Tanlang</option>
                                       <option value="new">Yangi</option>
                                       <option value="success">Kursga qatnashadiganlar</option>
                                       <option value="phone_off">Telefoni o'chirilgan</option>
                                       <option value="dont_phone_answered">Telefoni o'chirilgan</option>
                                       <option value="rejected">Kurga qatnashmaydi</option>
                                    </select>
                                 </div>
                                 <div className='col-lg-6 col-12'>
                                    <label htmlFor="courseTitle" className='font-gilroy-bold text-dark form-label'>Kurs</label>
                                    <select value={course} onChange={e => setCourse(e.target.value)}  name="courseTitle" id="courseTitle" className='form-control font-gilroy-medium'>
                                       <option value="">Tanlang</option>
                                       {courseOptions.map(item => (
                                          <option key={item.value} value={item.value}>{item.label}</option>
                                       ))}
                                    </select>
                                 </div>
                                 <div className="col-lg-6 col-12 mt-3">
                                    <button className={`btn btn-primary`}>
                                       <i className='bi bi-search'></i>
                                    </button>
                                 </div>
                              </form>
                           </div>
                        </div>
                        <div className='col-12 mb-3'>
                           <button className="btn btn-primary font-gilroy-bold w-100" type="button" data-bs-toggle="collapse" data-bs-target="#course">
                              Kurs bo'yicha filterlash
                           </button>
                           <div className="collapse py-3" id="course">
                              <div className="row">
                                 <form className='col-lg-12 col-12' onSubmit={getCourseFilter.handleSubmit}>
                                    <label htmlFor="course" className='font-gilroy-bold text-dark form-label'>Kurs</label>
                                    <div className='input-group'>
                                       <select name="courseName" id="courseName" className='form-control font-gilroy-medium' value={getCourseFilter.values.courseName} onChange={getCourseFilter.handleChange}>
                                          <option value="">Tanlang</option>
                                          {courseOptions.map(item => (
                                             <option key={item.value} value={item.value}>{item.label}</option>
                                          ))}
                                       </select>
                                       <button className='btn btn-primary'>
                                          <i className='bi bi-search'></i>
                                       </button>
                                    </div>
                                    <div className="invalid-feedback text-start font-gilroy-medium" style={{ display: 'block' }}>
                                       {getCourseFilter.errors.courseName !== undefined && getCourseFilter.errors.courseName}
                                    </div>
                                 </form>
                              </div>
                           </div>
                        </div>
                        <div className='col-12 mb-3'>
                           <button className="btn btn-primary font-gilroy-bold w-100" type="button" data-bs-toggle="collapse" data-bs-target="#date">
                              Sana bo'yicha filterlash
                           </button>
                           <div className="collapse py-3" id="date">
                              <form className='row' onSubmit={isSearch ? getAll : getDateFilter}>
                                 <div className='col-lg-6 col-12'>
                                    <label htmlFor="startDate" className='font-gilroy-bold text-dark form-label'>... sanadan</label>
                                    <input value={startDate} onChange={e => setStartDate(e.target.value)} type="date" className='form-control' id='startDate' />
                                 </div>
                                 <div className='col-lg-6 col-12'>
                                    <label htmlFor="endDate" className='font-gilroy-bold text-dark form-label'>... sanagacha</label>
                                    <input value={endDate} onChange={e => setEndDate(e.target.value)} type="date" className='form-control' id='endDate' />
                                 </div>
                                 <div className='col-lg-6 col-12 mt-3'>
                                    <button className={`btn btn-${isSearch ? 'success' : 'primary'}`}>
                                       <i className={`bi bi-search`}></i>
                                    </button>
                                 </div>
                              </form>
                           </div>
                        </div>
                        <div className="col-12 mb-3">
                           <button className="btn btn-primary font-gilroy-bold w-100" type="button" data-bs-toggle="collapse" data-bs-target="#search">
                              Qidirish
                           </button>
                           <div className="collapse py-3" id="search">
                              <input 
                                 type="text" 
                                 className='form-control' 
                                 placeholder='Qidirish...' 
                                 value={searchValue}
                                 onChange={onQueryChange}
                              />
                           </div>
                        </div>
                        <div className="col-12">
                           <button className='btn btn-primary w-100' onClick={updatePage}>
                              Sahifani yangilash
                           </button>
                        </div>
                     </div>
                     <div className="card-body pt-3 pb-3">
                        <StudentList clickedStudent={clickedStudent} getAll={getAll} data={data} currentPage={currentPage}/>
                        <div className='d-flex align-items-center justify-content-between'>
                           {!isSearch && (
                              pageCount > 1 && (
                                 <Paginate
                                    setData={setData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    pageCount={pageCount}
                                    type={'student'}
                                 />
                              )
                           )}
                           {clickedStudents.length > 0 && (
                              <>
                                 <button 
                                    className='btn btn-success font-gilroy-medium'
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#sendMessageuser"
                                    aria-controls="offcanvasRight"
                                 >
                                    <i className='bi bi-envelope-fill'></i>
                                 </button>
                                 <SendSms type={'user'} students={clickedStudents} />
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   )
}

const StudentList = ({ clickedStudent, getAll, data, currentPage }) => {
   const updateStatus = async (id, status) => {
      const isConfirm = window.confirm("Rostan ham status o'zgartirmoqchimisz?")
      if (isConfirm) {
         const { response } = await studentApi.updateStatus(id, status);

         if (response) {
            toast.success("Muvaffaqqiyatli status o'zgartirildi");
            getAll()
         }

         if (err) toast.error(err.message);
      }
   }
   return (
      <div className='table-responsive'>
         <table style={{ width: 1500 }} className='student table table-bordered table-hover table-striped'>
            <thead className='font-gilroy-bold'>
               <tr className='text-center'>
                  <th></th>
                  <th>#</th>
                  <th>Ism familiyasi</th>
                  <th>Telefon</th>
                  <th>Kursi</th>
                  <th>Kurs vaqti</th>
                  <th>Holati</th>
                  <th>Ro'yxatdan o'tgan vaqti</th>
                  <th>Status o'zgartirish</th>
               </tr>
            </thead>
            <tbody>
               {data.map((item, index) => (
                  <tr key={item.id} className="text-center font-gilroy-medium">
                     <td>
                        <input onClick={(e) => {
                           clickedStudent(e, item.id)
                        }} type="checkbox" className='form-check-input' />
                     </td>
                     <td>{currentPage * 10 - 10 + index + 1}</td>
                     <td>{item.fullName}</td>
                     <td>{item.phoneNumber}</td>
                     <td>{item.course.title}</td>
                     <td>{item.courseTime.title}</td>
                     <td>
                        {item.status === 'new' && <span className='text-secondary font-gilroy-bold'>Yangi</span>}
                        {item.status === 'success' && <span className='text-success font-gilroy-bold'>Kursga qatnashadi</span>}
                        {item.status === 'rejected' && <span className='text-danger font-gilroy-bold'>Kursga qatnashmaydi</span>}
                        {item.status === 'phone_off' && <span className='text-dark font-gilroy-bold'>Telefoni o'chirilgan</span>}
                        {item.status === 'dont_phone_answered' && <span className='text-warning font-gilroy-bold'>
                           Telefonga javob bermadi
                        </span>}
                     </td>
                     <td>
                        {moment(item.createdAt).format('DD.MM.YYYY HH:mm')}
                     </td>
                     <td>
                        <StatusButton icon={'check-circle'} type={'success me-2'} updateStatus={updateStatus} id={item.id} status={'success'} />
                        <StatusButton icon={'question-circle-fill'} type={'warning me-2'} updateStatus={updateStatus} id={item.id} status={'dont_phone_answered'} />
                        <StatusButton icon={'telephone-x-fill'} type={'dark me-2'} updateStatus={updateStatus} id={item.id} status={'phone_off'}/>
                        <StatusButton icon={'x-circle'} type={'danger'} updateStatus={updateStatus} id={item.id} status={'rejected'}/>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}

const AddStudent = ({ getAll, courseOptions, courseTimeOptions }) => {
  const [isRequest, setIsrequest] = useState(false);

   const addStudent = useFormik({
      initialValues: {
         fullName: "",
         phoneNumber: "",
         course: "",
         courseTime: ""
      },
      validationSchema: Yup.object({
         fullName: Yup.string()
           .min(1, "Kamida 1ta belgi kiriting")
           .required("O'quvchi ism familiyasini kiritish shart"),
         phoneNumber: Yup.string()
           .min(1, "Kamida 1ta belgi kiriting")
           .required("O'quvchi telefon raqamini kiritish shart"),
         course: Yup.string()
           .min(1, "Kamida 1ta belgi kiriting")
           .required("Kursni tanlash shart"),
         courseTime: Yup.string()
           .min(1, "Kamida 1ta belgi kiriting")
           .required("Kurs vaqtini kiritish shart"),
      }),
      onSubmit: async values => {
         const params = {
            fullName: values.fullName,
            phoneNumber: `998${values.phoneNumber.split('-').join('')}`,
            course: values.course,
            courseTime: values.courseTime
         }
         setIsrequest(true)
         const { response, err } = await studentApi.create(params);
         setIsrequest(false);

         if (response) {
            toast.success("O'quvchi muvaffaqqiyatli ro'yxatdan o'tkazildi");
            getAll();
         }

         if (err) toast.error(err.message);
      }
   })
   return (
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="addStudent" aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h5 className="offcanvas-title font-gilroy-bold" id="offcanvasRightLabel">
               O'quvchi ro'yxatga olish
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <div className="offcanvas-body">
            <form onSubmit={addStudent.handleSubmit}>
               <div className='mb-3'>
                  <label htmlFor="fullName" className='form-label font-gilroy-medium card-title mb-0'>
                     Ism Familiya
                  </label>
                  <input 
                     type="text" 
                     id='fullName' 
                     className='form-control font-gilroy-medium' 
                     placeholder='Eshmat Toshmatov'
                     name="fullName"
                     value={addStudent.values.fullName}
                     onChange={addStudent.handleChange}
                  />

                  <div className="invalid-feedback text-start font-gilroy-medium" style={{ display: 'block' }}>
                     {addStudent.errors.fullName !== undefined && addStudent.errors.fullName}
                  </div>
               </div>
               <div className='mb-3'>
                  <label htmlFor="phoneNumber" className='form-label font-gilroy-medium card-title mb-0'>
                     Telefon raqam
                  </label>
                  <InputMask 
                     type="text" 
                     id='phoneNumber' 
                     className='form-control font-gilroy-medium' 
                     placeholder='99-123-45-67'
                     mask={"99-999-99-99"}
                     name="phoneNumber"
                     value={addStudent.values.phoneNumber}
                     onChange={addStudent.handleChange}
                  />
                  <div className="invalid-feedback text-start font-gilroy-medium" style={{ display: 'block' }}>
                     {addStudent.errors.phoneNumber !== undefined && addStudent.errors.phoneNumber}
                  </div>
               </div>
               <div className='mb-3'>
                  <label htmlFor='course' 
                     className='form-label font-gilroy-medium card-title mb-0'
                  >
                     Kurs
                  </label>
                  <select 
                     name="course" 
                     id="course" 
                     className='form-control font-gilroy-medium'
                     value={addStudent.values.course}
                     onChange={addStudent.handleChange}
                  >
                     <option value="">Tanlang</option>
                     {courseOptions.map(item => (
                        <option value={item.value} key={item.value}>{item.label}</option>
                     ))}
                  </select>

                  <div className="invalid-feedback text-start font-gilroy-medium" style={{ display: 'block' }}>
                     {addStudent.errors.course !== undefined && addStudent.errors.course}
                  </div>
               </div>
               <div className='mb-3'>
                  <label htmlFor='courseTime' 
                     className='form-label font-gilroy-medium card-title mb-0'
                  >
                     Kurs vaqti
                  </label>
                  <select 
                     name="courseTime" 
                     id="courseTime" 
                     className='form-control font-gilroy-medium'
                     value={addStudent.values.courseTime}
                     onChange={addStudent.handleChange}
                  >
                     <option value="">Tanlang</option>
                     {courseTimeOptions.map(item => (
                        <option value={item.value} key={item.value}>{item.label}</option>
                     ))}
                  </select>

                  <div className="invalid-feedback text-start font-gilroy-medium" style={{ display: 'block' }}>
                     {addStudent.errors.courseTime !== undefined && addStudent.errors.courseTime}
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

const SendSms = ({ students, type }) => {
   const token = localStorage.getItem('smsToken')
   const [smsTemplates, setSmsTemplates] = useState([]);
   const [isCheck, setIscheck] = useState(false);
   const [message, setMessage] = useState('');
   const [isRequest, setIsrequest] = useState(false)

   const getSmsTemplates = async () => {
      const { response, err } = await smsTemplateApi.getAll()

      if (response) setSmsTemplates(response.smsTemplates)

      if (err) toast.error(err.message);
   }

   useEffect(() => {
      getSmsTemplates();
   }, [])

   const changeType = () => {
      setIscheck(!isCheck);
   }

   const sendMessage = async (e) => {
      e.preventDefault()
      setIsrequest(true)
      
      if (message.trim().length === 0) {
         toast.warning("Xabar kiritilmagan");
         return
      }

      if(type == 'all') {
         const { response, err } = await smsApi.sendMessageAllUser(message, token);

         setIsrequest(false)

         if (response) {
            response.map(item => toast.success(`${item.phone} ga xabar jo'natildi`));
            setMessage('')
         }
   
         if (err) toast.error(err.message);
      } else {
         const { response, err } = await smsApi.sendMessage(students, message, token);

         setIsrequest(false)

         if (response) {
            response.map(item => toast.success(`${item.phone} ga xabar jo'natildi`));
            setMessage('')
         }
   
         if (err) toast.error(err.message);
      }
   }
   return (
      <div className="offcanvas offcanvas-end" tabIndex="-1" id={`sendMessage${type}`} aria-labelledby="offcanvasRightLabel">
         <div className="offcanvas-header">
            <h5 className="offcanvas-title font-gilroy-bold" id="offcanvasRightLabel">
               Xabar jo'natish
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
         </div>
         <form className="offcanvas-body" onSubmit={sendMessage}>
            <div className='mb-3'>
               <label htmlFor="type-message" className='form-label font-gilroy-bold me-3'>SMS shablondan foydalanish</label>
               <input onClick={changeType} type="checkbox" className='form-check-input' id='type-message' />
            </div>
            {isCheck ? (
               <div className='mb-3'>
                  <label htmlFor="messageText" className='form-label font-gilroy-bold'>SMS Shablonlar</label>
                  <select id="type-message" className='form-control' value={message} onChange={e => setMessage(e.target.value)}>
                     <option value="">Tanlang</option>
                     {smsTemplates.map(item => (
                        <option value={item.id} key={item.id}>{item.title}</option>
                     ))}
                  </select>
               </div>
            ): (
               <div className='mb-3'>
                  <label htmlFor="messageText" className='form-label font-gilroy-bold'>Xabar yozish</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder='Xabar yozish...' id="messageText" rows="10" className='form-control font-gilroy-medium'></textarea>
               </div>
            )}

            <button className='btn btn-primary'>
               <i className='bi bi-envelope'></i>
               {isRequest && <Loader/>}
            </button>
         </form>
      </div>
   )
}

export default Student