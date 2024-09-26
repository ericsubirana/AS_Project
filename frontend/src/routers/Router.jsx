import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../home/Home.jsx";
import AuthProvider from "../AuthProvider.jsx";

function Router() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default Router;