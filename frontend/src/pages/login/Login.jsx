import React from "react";
import Header from "../../header/Header";
import './login.css'
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigation = useNavigate();

    return(
        <>
            <Header/>
            <div id="login">
                <form name='form-login'>
                    <span className="fontawesome-user"></span>
                    <input type="text" id="user" placeholder="Username"/>
                    <span className="fontawesome-lock"></span>
                    <input type="password" id="pass" placeholder="Password"/>
                    <input type="submit" value="Login"/>
                    <p>Forgot password?</p>
                    <p onClick={()=>{navigation("/register")}}>Register</p>
                </form>
            </div>
        
        </>
    
    )
    
}

export default Login;