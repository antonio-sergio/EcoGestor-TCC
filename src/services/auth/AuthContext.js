import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [expiresAt, setExpiresAt] = useState(
    Number(localStorage.getItem("expiresAt")) || null
  );
  const [user, setUser] = useState(() => {
    if (localStorage.getItem("token")) {
      let token = JSON.parse(localStorage.getItem("token"));
      return jwt_decode(token);
    }
    return null;
  });

  useEffect(() => {
    if(user){
        const now = new Date().getTime() / 1000;
        if (Number(now) > Number(localStorage.getItem("expiresAt"))) {
          localStorage.removeItem("token");
          localStorage.removeItem("expiresAt");
          setUser(null);
          navigate("/login");
        }
        console.log('user', user);
    }
  }, [expiresAt, navigate]);

  const login = async (payload) => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    const apiResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/login`,
      payload
    );

    console.log('respose login', apiResponse);
    if (apiResponse.status === 200) {
      localStorage.setItem(
        "token",
        JSON.stringify(await apiResponse.data.token)
      );
      let x = await jwt_decode(apiResponse.data.token);
      localStorage.setItem("expiresAt", x.exp);
      setExpiresAt(Number(x.exp));
      setUser(x);
      navigate("/");
    } else {
      console.log("else resonse api");
      return null;
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
