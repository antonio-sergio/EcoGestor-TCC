import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        if (localStorage.getItem("token")) {
            let token = JSON.parse(localStorage.getItem("token"));
            return jwt_decode(token);
        }
        return null;
    });

    const login = async (payload) => {
        const apiResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/login`,
            payload
        );
        localStorage.setItem("token", JSON.stringify(apiResponse.data));
        setUser(jwt_decode(apiResponse.data.token));
        navigate("/");
    };

    const logout = async () => {
        // invoke the logout API call, for our NestJS API no logout API
        localStorage.removeItem("token");
        setUser(null);
        return <Navigate to="/login"></Navigate>;
    };
    
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;