import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../AuthProvider";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import './lessonpopup.css'
import 'react-toastify/dist/ReactToastify.css';

function LessonPopUp(props) {

    const { user, lessonAdded, setLessonAdded, admin } = useAuth();

    const addLesson = async (event) => {
        event.preventDefault();
        if(!admin){
            return
        }
        
        const lessonName = event.target.lessonName.value;
        const file = event.target.fileInput.files[0];
    
        if (!file) {
            toast.error('Please select a file!');
            return;
        }
    
        // Verificar que el archivo sea un PDF
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed!');
            return;
        }
    
        // Opcional: Verificar tamaño de archivo, ej. 5MB máximo
        const maxSize = 5 * 1024 * 1024; // 5 MB en bytes
        if (file.size > maxSize) {
            toast.error('File size exceeds 5MB limit!');
            return;
        }
    
        const formData = new FormData();
        formData.append('lessonName', lessonName);
        formData.append('file', file);
        formData.append('className', props.className);
    
        try {
            const response = await fetch('http://localhost:5000/uploadLesson', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
    
            if (response.ok) {
                const result = await response.json();
                toast.success('Lesson added successfully!');
                await setLessonAdded(!lessonAdded);
                props.setTrigger(false); 

            } else {
                toast.error('Error uploading lesson');
            }
        } catch (error) {
            console.error('Error uploading lesson:', error);
            toast.error('An error occurred during upload');
        }
    
        props.setTrigger(false);
    };

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

    return (
        <>
            <ToastContainer position='top-center' />
            {admin && (
                <div>
                    {props.trigger && (
                        <div className="lessonPopUp">
                            <div className="classForm" ref={classFormRef}>
                                <form onSubmit={addLesson}>
                                    <div className="classInput">
                                        <span className="fontawesome-user"></span>
                                        <input type="text" id="lessonName" name="lessonName" placeholder="Lesson Name" required />
                                    </div>
                                    <div className="classInput">
                                        <div className="file-upload">
                                            <span className="fontawesome-user"></span>
                                            <label htmlFor="fileInput" className="custom-file-label">Seleccionar archivo</label>
                                            <input type="file" id="fileInput" className="inputfile" accept="application/pdf" />
                                        </div>
                                    </div>
                                    <div className="classInput">
                                        <input type="submit" value="ADD LESSON" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>

    )

}

export default LessonPopUp;