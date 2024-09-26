import React from "react";
import { useAuth } from "../AuthProvider";
import logo from "../../public/logo.jpeg";

import "../header/header.css"
import { useNavigate } from "react-router-dom";

const Header = () => {
   
    const {user, signup} = useAuth();
    const navigation = useNavigate();

    return (
       <div className="allHeader">
            {user?.length > 0 ? (
                <div className="header">
                    <div className="img">
                        <img src={logo} alt="Logo" onClick={() => {navigation("/home")}}/>
                    </div>
                    <div className="title">
                        <h1>LANGUAGES ACADEMY</h1>
                    </div>
                    <div className="lore">
                            <button className="button-6" onClick={() => signup(null)}>LOGOUT</button>
                    </div>
                </div>
            ) : (
                <div>
                    <ul className="header">
                        <div className="img">
                            <img src={logo} alt="Logo" onClick={() => {navigation("/home")}} />
                        </div>
                        <h1 className="title">LANGUAGES ACADEMY</h1>
                        <div className="lore">
                            <button className="button-6" onClick={() => {navigation("/login")}}>LOGIN</button>
                            <button className="button-6" onClick={() => {navigation("/register")}}>REGISTER</button>
                        </div>
                    </ul>
                </div>
            )}
            <hr />
       </div>
    )
}

export default Header;