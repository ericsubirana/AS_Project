import React, { useEffect } from "react";
import { useAuth } from "../../AuthProvider";

import Header from "../../header/Header";
import Body from "../../body/Body"

function Home() {

    const { signup, user, admin } = useAuth();

    useEffect ( () => {
        console.log('epa')
    }, [])

    return (
        <>
            <Header/>
            <Body />
        </>
    )
}

export default Home;

