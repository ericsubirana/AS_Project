import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";

import './body.css'
import ClasePopUp from "../clasePopUp/ClasePopUp";

function Body() {

    const { signup, user, admin } = useAuth();
    const [trigger, setTrigger] = useState(false);

    useEffect (() => {
        const getClassses = async () => {
            if(admin)
            {

            }
            else if(user){

            }            
        }
    }, [])

    const addClass = async () => {
        setTrigger(!trigger)
    }

    return (
        <>
            {user?.length > 0 ? (
                <div>
                    {(admin == true) ? (
                        <div>
                            <div className="addClassButton">
                                <button onClick={addClass} className="button-6">ADD CLASS</button>
                            </div>
                            <ClasePopUp trigger={trigger} />
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

