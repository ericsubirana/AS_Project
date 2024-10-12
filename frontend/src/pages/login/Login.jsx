import React from "react";
import Header from "../../header/Header";
import './login.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import bcrypt from 'bcryptjs';
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
const Login = () => {

    const navigation = useNavigate();
    const {login} = useAuth();
    const loginUser = async (event) => {
        console.log("Principio");
        event.preventDefault(); // Prevent page refresh
        // setError(null); // Clear any previous errors
        console.log("PREMAIL")
        const email = event.target.user.value;
        const password = event.target.pass.value;
        console.log(email);
        console.log(password);
        // Basic form validation
        if (!email || !password) {
            toast.error("Both fields are required.");
            return;
        }
        try {
            // Hash the password before sending it to the backend
            console.log("TRY");
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Prepare data to send
            const values = {
                email: email,
                password: hashedPassword,
            };
            console.log("PRE RESPONSE");
            // Send POST request to Flask backend
            const response = await axios.post('http://localhost:5000/login', values);
            // Handle response from Flask
            console.log("AFTER RESPONSE");
            if (response.data.success) {
                toast.success("Logged in successfully!");
                // Redirect to the home page after successful login
                setTimeout(() => {
                    navigate('/home');
                }, 2000); // Optional delay for showing success message
            } else {
                // Show error message if login fails
                setError('Invalid email or password');
                toast.error("Invalid email or password");
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
            toast.error("Something went wrong. Please try again.");
        }
    };


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