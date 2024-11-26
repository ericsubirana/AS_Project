import Header from "../../header/Header"
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../AuthProvider";

import LessonPopUp from "../../lessonPopUp/LessonPopUp";

import './class.css'

function Class() {

    const location = useLocation();
    const { cls } = location.state || {}; //el passem desde el body un cop cliquem la classe
    const [trigger, setTrigger] = useState(false);
    const { admin, lessonAdded, user, setLessonAdded } = useAuth();
    const [classs, setClasss] = useState([])

    useEffect(() => {
        const getClass = async () => {
            if (user) { //case anyone is logged
                const values = { 'className': cls.className }
                const response = await fetch('http://localhost:5000/getClass', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(values)
                })
                const data = await response.json()
                setClasss(data.class)
            }
        }
        getClass();

    }, [lessonAdded, trigger, user])

    const deleteStudent = async (student, className) => {
        try {
            const values = { 'className': className, 'student': student }
            const response = await fetch('http://localhost:5000/deleteStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            await response.json()
            setLessonAdded(!lessonAdded) //canviem el valor perque s'executi el useffect de dalt
        } catch (error) {
            console.log(error)
        }
    }

    const uploadFile = async (value) => {
        try {
            const response = await fetch(`http://localhost:5000/getLesson/${value}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Convert the response into a Blob (binary data)
            const blob = await response.blob();

            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Specify the filename (you can extract this from the response headers if needed)
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'downloadedFile.pdf'; // Default filename

            a.download = filename;
            document.body.appendChild(a); // Append the link to the DOM
            a.click(); // Trigger the download
            a.remove(); // Clean up the DOM

            // Revoke the object URL after the download
            window.URL.revokeObjectURL(url);
        }
        catch (err) {
            console.error('Error downloading the file:', err);
        }
    }

    const removeLesson = async (className, file) => {
        try {
            const values = { 'className': className, 'file': file }
            const response = await fetch('http://localhost:5000/deleteLesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(values)
            })
            await response.json()
            setLessonAdded(!lessonAdded) 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Header />
            <div className="singleClass">
                <h1>{classs?.className}</h1>
                <div className="lesdocstu">
                    <LessonPopUp trigger={trigger} setTrigger={setTrigger} className={cls.className} />
                    <div className="lessons">
                        <h4>Lessons & Documents</h4>
                        <hr />
                        {admin && (
                            <div>
                                <div className="addLessonButton"><button className="button-6" onClick={() => setTrigger(!trigger)}>ADD LESSON</button></div>
                            </div>
                        )}
                        <div className="studentsListClass">
                            {classs?.lessons?.map((lesson, index) => (
                                <div key={index} className="studentList">
                                    <p className="lessonName" onClick={() => { uploadFile(lesson.file_id) }}>
                                        {lesson.lesson_name}
                                    </p>
                                    {admin && (
                                        <div className="deleteLesson" onClick={() => removeLesson(classs?.className, lesson)}> x </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {admin && (
                        <div className="studentsPart">
                            <h4>Students</h4>
                            <hr />
                            <div className="studentsListClass">
                                {classs?.students?.map((student, index) => (
                                    <div key={index} className="studentList">
                                        <p>
                                            {student}
                                        </p>
                                        <div onClick={() => deleteStudent(student, classs?.className)} className="deleteStudent">
                                            x
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Class