import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "../home/Home.jsx";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Home/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;