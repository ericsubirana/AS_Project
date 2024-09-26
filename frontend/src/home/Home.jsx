import React, { useEffect } from "react";
import { useAuth } from "../AuthProvider";

import Header from "../header/Header";

function Home() {

    const { signup, user } = useAuth();

    useEffect ( () => {
        console.log('epa')
    }, [])

    return (
        <>
            <Header/>
            {user?.length > 0 ? (
                <div>
                    <h1>HI {user}!!</h1>
                    <ul>
                        <li>CLASS1</li>
                        <li>CLASS2</li>
                        <li>CLASS3</li>
                    </ul>
                </div>
            ) : (
                <div>
                    YOU NEED TO REGISTER IN ORDER TO GET INTO ANY CLASS
                </div>
            )}
        </>
    )
}

export default Home;

