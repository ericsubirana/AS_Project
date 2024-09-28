import React, {useState     } from "react";
import Header from "../../header/Header";
import './register.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import bcrypt from 'bcryptjs';

import 'react-toastify/dist/ReactToastify.css';
const Register = () => {

    const navigation = useNavigate();
    const {signup} = useAuth();

    const registerUser = (event) =>
    {
        event.preventDefault();
        const form = event.target;

        if (!form.mail.value || !form.user.value || !form.pass.value) {
            toast.error("All fields are required.");
            return;
        }

        const saltRounds = 10; 
        bcrypt.hash(event.target.pass.value, saltRounds).then(x=> {
            const values = {
                email: form.mail.value,
                username: form.user.value,
                password: x
            };
    
            signup(values)
        });
    }

    return(
        <>
            <Header/>
            <div id="login">
                <ToastContainer position='top-center' />
                <form name='form-login' onSubmit={registerUser}>
                    <span className="fontawesome-lock"></span>
                    <input type="text" id="mail" name="mail" placeholder="Email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(org|net|com)$"/>
                    <span className="fontawesome-user"></span>
                    <input type="text" id="user" name="user" placeholder="Username" required/>
                    <span className="fontawesome-lock"></span>
                    <input type="password" id="pass" name="pass" placeholder="Password" required/>
                    <input type="submit" value="Register"/>
                    <p onClick={()=>{navigation("/login")}}>Already have an account? Login</p>
                </form>
            </div>
        
        </>
    
    )
    
}

export default Register;