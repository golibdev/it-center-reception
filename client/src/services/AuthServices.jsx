import adminApi from '../api/modules/admin.api';
const keyUser = 'token';

function setSession(response) {
   const merged = {
     token: response.token
   };
 
   localStorage.setItem(keyUser, JSON.stringify(merged));
}

function getSession() {
   const token = localStorage.getItem(keyUser);
 
   return token
}

function isAuth() {
   return !!getSession();
}

async function login(params) {
   const { response, err } = await adminApi.signin(params)
   if(response) {
      setSession(response);
      return { response }
   }

   if(err) return { err }
}

async function logout(navigate) {
   try {
      localStorage.clear(keyUser);
      navigate('/')
   } catch (err) {}
}

export {
   getSession, isAuth, login, logout
}