import { useContext } from "react";
import { Navigate } from "react-router-dom";
import  AuthContext  from "../auth/AuthContext";

const ProtectedRoute = ({ children, accessBy }) => {
    const { user } = useContext(AuthContext);
    
    if (accessBy === "authenticated") {
        if (user) {
            return children;
        }
    }

    return <Navigate to="/login"></Navigate>;
};

export default ProtectedRoute;