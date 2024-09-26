import React from "react";
import { useAuth } from "../AuthProvider";
import logo from "../../public/logo.jpeg";

import "../header/header.css"

const Header = () => {
   
    const {user, signup} = useAuth();

    return (
       <div className="allHeader">
            {user?.length > 0 ? (
                <div className="header">
                    <div className="img">
                        <img src={logo} alt="Logo"/>
                    </div>
                    HI {user}
                    <div className="lore">
                            <button className="button-6" onClick={() => signup(null)}>LOGOUT</button>
                    </div>
                </div>
            ) : (
                <div>
                    <ul className="header">
                        <div className="img">
                            <img src={logo} alt="Logo" />
                        </div>
                        <div className="lore">
                            <button className="button-6" onClick={() => signup('PEPE')}>LOGIN</button>
                            <button className="button-6" onClick={() => signup('PEPE')}>REGISTER</button>
                        </div>
                    </ul>
                </div>
            )}
       </div>
    )
}

export default Header;