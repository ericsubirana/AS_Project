import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

import './body.css'
import ClasePopUp from "../clasePopUp/ClasePopUp.jsx";

function Body() {

    const { signup, user, admin, lessonAdded } = useAuth();
    const [trigger, setTrigger] = useState(false);
    const [classes, setClassses] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const getClassses = async () => {
            if (user) { //case anyone is logged
                const values = { 'admin': admin, 'email': user } //a user guardem el mail
                const response = await fetch('http://localhost:5000/getClasses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(values)
                })
                const data = await response.json()
                setClassses(data.classes);
            }
        }
        getClassses();
    }, [admin, user, lessonAdded])

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
                            <ClasePopUp trigger={trigger} setTrigger={setTrigger} />
                            {classes?.length > 0 && (
                                <div className="classObjs">
                                    {
                                        classes.map((cls, index) => (
                                            <div onClick={() => navigate('/class', { state: { cls } })} className="classObj" key={index}>
                                                <p>{cls.className}</p>
                                                <hr />
                                                <div className="lessonsList">
                                                    {cls?.lessons?.map((lesson, index) => (
                                                        <p key={index}>
                                                            • {lesson.lesson_name}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {classes?.length > 0 && (
                                <div className="classObjs">
                                    {
                                        classes.map((cls, index) => (
                                            <div onClick={() => navigate('/class', { state: { cls } })} className="classObj" key={index}>
                                                <p>{cls.className}</p>
                                                <hr />
                                                <div className="lessonsList">
                                                    {cls?.lessons?.map((lesson, index) => (
                                                        <p key={index}>
                                                            • {lesson.lesson_name}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
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

