import { createContext } from "react";
import { isAuth, getSession, login, logout } from '../services/AuthServices'

const AuthContext = createContext(null);

function AuthProvider({ children, ...rest }) {
   const auth = {
      getSession,
      isAuth,
      login,
      logout
   };

   return (
      <AuthContext.Provider value={auth} {...rest}>
         {children}
      </AuthContext.Provider>
   )
}

export { AuthContext };
export default AuthProvider;