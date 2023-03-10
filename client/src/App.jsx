import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AppLayout from './components/layouts/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Notfound from './pages/Notfound';
import MainLayout from './components/layouts/MainLayout';
import AuthProvider from './hooks/AuthProvider';
import Course from './pages/Course';
import CourseTime from './pages/CourseTime';
import SmsTemplate from './pages/SmsTemplate';
import Student from './pages/Student';
import SmsStatus from './pages/SmsStatus';

const App = () => {
  return (
    <AuthProvider>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout/>}>
            <Route index element={<Login/>} />
            <Route path='*' element={<Notfound/>} />
          </Route>
          <Route path='/admin' element={<AppLayout/>}>
            <Route index element={<Home/>} />
            <Route path='/admin/course' element={<Course/>} />
            <Route path='/admin/course-time' element={<CourseTime/>} />
            <Route path='/admin/sms-template' element={<SmsTemplate/>} />
            <Route path='/admin/student' element={<Student/>} />
            <Route path='/admin/sms-status' element={<SmsStatus/>} />
            <Route path='*' element={<Notfound/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;