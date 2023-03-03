import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import adminApi from '../api/modules/admin.api';
import { setAdmin } from '../redux/features/adminSlice'

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);

  const signInForm = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(1, "username minimum 1 character")
        .required("Username is required"),
      password: Yup.string()
        .min(8, "Password minimum 8 character")
        .required("Password is required")
    }),
    onSubmit: async values => {
      setIsLoginRequest(true)
      const { response, err } = await login(values);
      setIsLoginRequest(false);

      if(response) {
        toast.success("Successfuly signin")
        dispatch(setAdmin(response));
        navigate('/')
      }

      if (err) {
        toast.error(err.message);
      }
    }
  })
  return (
    <div className='row'>
      <div className="col-lg-6 offset-lg-3">
        <form className="card shadow" onSubmit={signInForm.handleSubmit}>
          <div className="card-header bg-white">
            <h1 className='text-center card-text font-gilroy-bold p-0 m-0'>
              Manager Login
            </h1>
          </div>
          <div className="card-body pt-3">
            <div className='mb-3 input-group'>
              <span className='input-group-text card-title m-0 px-3 py-0 font-gilroy-bold form-label'>
                <i className='bi bi-person-fill'></i>
              </span>
              <input type="text" className='form-control' name='username' id='username' placeholder='Enter your username...' value={signInForm.values.username} onChange={signInForm.handleChange} />
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {signInForm.errors.username !== undefined && signInForm.errors.username}
              </div>
            </div>
            <div className='input-group'>
              <span className='input-group-text card-title m-0 px-3 py-0 font-gilroy-bold form-label'>
                <i className='bi bi-lock-fill'></i>
              </span>
              <input type="password" className='form-control' name='password' id='password' placeholder='Enter your password...' value={signInForm.values.password} onChange={signInForm.handleChange} />
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {signInForm.errors.password !== undefined && signInForm.errors.password}
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className='btn btn-primary d-block w-100'>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login