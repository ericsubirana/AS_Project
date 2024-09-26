import React from "react";
import { useAuth } from "../AuthProvider";

function Home() {

    const { signup, user } = useAuth();

    return (
        <>
            <button onClick={() => signup('PEPE')}>CLICK TO SIGNUP</button>
            <h3>{user}</h3>
            {user?.length > 0 && (
                <div>
                    YOU ARE REGISTERED
                </div>
            )}
        </>
    )
}

export default Home;

