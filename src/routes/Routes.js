import React from "react";
import {
    Route,
    Routes
} from 'react-router-dom';
import ProtectedRoute from "../services/auth/ProtectedRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import CollectRequest from "../pages/HomeUser";
import Signup from "../pages/Signup";
import LandingPage from "../pages/LandingPage";

export default function RoutesApp() {
    return (
        <Routes >
            {/* <Route path='/' element={<ProtectedRoute accessBy="authenticated"><Home /></ProtectedRoute>} /> */}
            <Route path='/' element={<ProtectedRoute accessBy="admin"><Home /></ProtectedRoute>} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/Landing' element={<LandingPage />} />
            <Route path='/Home' element={<ProtectedRoute accessBy="authenticated"><CollectRequest /></ProtectedRoute>} />
        </Routes >
    )
}