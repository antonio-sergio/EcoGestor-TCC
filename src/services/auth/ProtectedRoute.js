import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext  from "../auth/AuthContext";

const ProtectedRoute = ({ children, accessBy }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    if (accessBy === "any") {
        return children;
    }

    if (accessBy === "authenticated") {
        if (user) {
            return children;
        }
    }

    if (accessBy === "admin" && user?.role === "admin") {
        return children;
    }

    return navigate("/");
};

export default ProtectedRoute;