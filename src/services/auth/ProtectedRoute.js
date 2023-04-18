import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../auth/AuthContext";

const ProtectedRoute = ({ children, accessBy }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (accessBy === "authenticated" && !user) {
            navigate("/login");
        } else if (accessBy === "admin" && (!user || user.role !== "admin")) {
            navigate("/login");
        }
    }, [accessBy, navigate, user]);

    return children;
};

export default ProtectedRoute;