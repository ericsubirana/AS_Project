import React from "react";
import Header from "../../header/Header";
import './register.css'
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigation = useNavigate();

    const registerUser = () =>
    {
        console.log('sending form by post')
    }

    return(
        <>
            <Header/>
            <div id="login">
                <form name='form-login' onSubmit={registerUser}>
                    <span className="fontawesome-lock"></span>
                    <input type="password" id="mail" placeholder="Email"/>
                    <span className="fontawesome-user"></span>
                    <input type="text" id="user" placeholder="Username"/>
                    <span className="fontawesome-lock"></span>
                    <input type="password" id="pass" placeholder="Password"/>
                    <input type="submit" value="Register"/>
                    <p onClick={()=>{navigation("/login")}}>Already have an account? Login</p>
                </form>
            </div>
        
        </>
    
    )
    
}

export default Register;