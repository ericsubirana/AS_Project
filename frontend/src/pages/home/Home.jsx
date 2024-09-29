import React, { useEffect } from "react";
import { useAuth } from "../../AuthProvider";
import { useLocation } from 'react-router-dom';

import Header from "../../header/Header";
import Body from "../../body/Body"

function Home() {

    const { signup, user, admin } = useAuth();
    const location = useLocation();

    return (
        <>
            <Header/>
            <Body />
        </>
    )
}

export default Home;

