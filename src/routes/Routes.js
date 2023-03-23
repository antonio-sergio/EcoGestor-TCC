import React from "react";
import {
    Route,
    Routes
} from 'react-router-dom';
import { useContext } from "react";
import AuthContext  from "../services/auth/AuthContext";
import ProtectedRoute from "../services/auth/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";

export default function RoutesApp() {
    const { user } = useContext(AuthContext);
    console.log('user', user);

    return (
        <Routes>
            <Route path='/' element={<ProtectedRoute accessBy="authenticated"><Home /></ProtectedRoute>} />
            <Route path='/Login' element={<Login />} />
        </Routes >
    )
}