import React, { useEffect } from "react";
import { useAuth } from "../AuthProvider";

import './body.css'

function Body() {

    const { signup, user, admin } = useAuth();

    return (
        <>
            {user?.length > 0 ? (
                <div>
                    {(admin == true) ? (
                        <div>
                            CAS ADMIN
                        </div>
                    ) : (
                        <div>
                            CAS USER
                        </div>
                    )}
                </div>
            ) : (
                <div className="home2">
                    <p>YOU NEED TO REGISTER IN ORDER TO GET INTO ANY CLASS</p>
                </div>
            )}
        </>
    )
}

export default Body;

