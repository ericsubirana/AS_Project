import { createContext, useState, useContext, useEffect } from "react";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe estar dentro del proveedor AuthContext');
    }
    return context;
}

const AuthProvider = ({children}) => { 
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);

    useEffect( () => {
        const userToken = Cookies.get('authToken');
        setToken(userToken);
        console.log(token)
    }, [])

    const signup = async (values) => {
        try {
            //const user = await registerReq(values);
            setUser(values);
        } catch (error) {
            setErrorContext("error.response.data");
        }
    }
    return(
        <AuthContext.Provider value={{
            user,
            signup
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;