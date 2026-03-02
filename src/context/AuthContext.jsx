import { createContext, useContext, useState } from "react";

// creating context for auth
const AuthContext = createContext();

function AuthProvider({ children }) {
  // check if user is already logged in (stored in localStorage)
  const [token, setToken] = useState(localStorage.getItem("auth_token") || null);
  const [phone, setPhone] = useState(localStorage.getItem("user_phone") || null);

  // called when user successfully logs in
  function login(authToken, userPhone) {
    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("user_phone", userPhone);
    setToken(authToken);
    setPhone(userPhone);
  }

  // called when user clicks logout
  function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_phone");
    setToken(null);
    setPhone(null);
  }

  // isLoggedIn will be true if token exists, false if not
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, phone, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook to use auth in any component
function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
