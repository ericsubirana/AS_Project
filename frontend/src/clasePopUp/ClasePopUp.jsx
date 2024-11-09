import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthProvider";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import './clasepopup.css'
import 'react-toastify/dist/ReactToastify.css';

function ClasePopUp(props) {

    const {user, admin} = useAuth();
    const [allStudents, setAllStudents] = useState([]) //query to get all students
    const [displayStudents, setDisplayStudents] = useState(false); 
    const [students, setStudents] = useState([]) //students that the teacher selected

    const classFormRef = useRef(null); 

    const handleClickOutside = (event) => {
        if (classFormRef.current && !classFormRef.current.contains(event.target)) {
            props.setTrigger(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const addClass = async (event) => {
        event.preventDefault()

        if(students.length == 0){
            toast.error("You need to add at least one student");
            return 
        }

        const className = event.target.className.value
        const values = {
            'emailTeacher': user,
            'className': className,
            'students': students
        }
        setStudents([])
        setDisplayStudents(false)
        fetch('http://localhost:5000/addClass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            credentials: 'include',
            body: JSON.stringify(values),
        }).then(x => {
            if(x.status == 400){
                toast.error("There exists a class with that name already");
                return
            }
            else{
                toast.success("Class created");
                window.location.reload()
                props.setTrigger(false)
            }
        })
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


    return (
        <>
            <ToastContainer position='top-center' />
            <div>
                {props.trigger && admin && (
                    <div className="clasePopUp"> 
                        <div className="classForm" ref={classFormRef}>
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