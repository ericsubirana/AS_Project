import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { useLocation } from 'react-router-dom';

import './clasepopup.css'

function ClasePopUp(props) {

    useEffect (() => {

        const takeStudents = async () => {
            const response = await fetch('http://localhost:5000/takeStudents',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            )
            const data = await response.json();
            setAllStudents(data.emails)
        }

        takeStudents();
    }, [])

    const addClass = async () => {
        //fer un from on possi nom de la classe i pugui afegir els alumnes que vulgui
        //cada classe tindrà user_admin (id del profe), name, powerpoiints {}
        /*{
        "user_admin": ObjectId("teacher_id_here"),
        "name": "Class Name",
        "powerpoints": [
            {
            "filename": "lesson1.pptx",
            "file_id": ObjectId("file_id_from_gridfs")
            }
        ],
        "students":[id1, id2]
        }
        */ 
    }

    const saveUser = async (item) => {
        if(students.includes(item))
        {
            setStudents(prevStudents => prevStudents.filter(student => student !== item));
        }
        else{
            setStudents(prevStudents => [...prevStudents, item]);
        }
    }

    const [allStudents, setAllStudents] = useState([])
    const [displayStudents, setDisplayStudents] = useState(false);
    const [students, setStudents] = useState([])

    return (
        <>
            <div>
                {props.trigger && (
                    <div className="clasePopUp"> 
                        <div className="classForm">
                            <form onSubmit={addClass}>
                                <div className="classInput">
                                    <span className="fontawesome-user"></span>
                                    <input type="text" id="className" name="className" placeholder="Class Name" required />
                                </div>
                                <div className="">
                                    <span className="fontawesome-user"></span>
                                    <div className="selectStudents" onClick={() => {setDisplayStudents(!displayStudents)}}>
                                        <p>Students</p>
                                        {displayStudents ? (
                                            <div className="arrow">△</div>
                                        ) : (
                                            <div className="arrow">▽</div>
                                        )}
                                    </div>
                                    {displayStudents && (
                                        <div className="studentsList">
                                            {allStudents.map((student, index) => (
                                                <p onClick={() => saveUser(student)} className={`pStudent ${students.includes(student) ? 'selected' : 'noSelected'}`} key={index}>
                                                    {student}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div> 
                                <div className="classInput">
                                    <input type="submit" value="ADD CLASS"/>
                                </div>                           
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>

    )

}

export default ClasePopUp;