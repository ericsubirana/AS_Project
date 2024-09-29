import React from "react";
import Header from "../../header/Header";
import './login.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import bcrypt from 'bcryptjs';

import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const navigation = useNavigate();
    const {login} = useAuth();

    const loginUser = (event) =>
    {
        event.preventDefault(); // Evita el refresh de la página

        const email = event.target.user.value;
        const password = event.target.pass.value;

        if (!email || !password) {
            toast.error("Both fields are required.");
            return;
        }

        const saltRounds = 10; 
        bcrypt.hash(password, saltRounds).then(x=> {
            const values = {
                email: email,
                password: x
            };
    
            login(values).then(() => {
                toast.success("Logged successfully!");
                setTimeout(() => {
                    navigation("/home");
                }, 2000); // Optional: adds delay to show the success message
            })
        });
    }

    return(
        <>
            <Header/>
            <div id="login">
                <ToastContainer position='top-center' />
                <form name='form-login' onSubmit={loginUser}>
                    <span className="fontawesome-user"></span>
                    <input type="text" id="user" name="user" placeholder="Email" required/>
                    <span className="fontawesome-lock"></span>
                    <input type="password" id="pass" name="pass" placeholder="Password" required/>
                    <input type="submit" value="Login"/>
                    <p>Forgot password?</p>
                    <p onClick={()=>{navigation("/register")}}>Register</p>
                </form>
            </div>
        
        </>
    
    )
    
}

export default Login;