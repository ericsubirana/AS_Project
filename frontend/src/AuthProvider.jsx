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

    useEffect( () => {
        const checkLogin = async () => {
            try{
                const response = await fetch('http://localhost:5000/verifyToken',
                    {
                        method: 'GET',
                        credentials: 'include'
                    }
                );
                const data = await response.json();

                if(!response.data)
                {
                    setUser(null)
                    setAdmin(null)
                }
        
                setUser(data.username)
                setAdmin(data.admin)
            }
            catch{
                console.log('error')
            }
    
        }

        checkLogin();
    }, [])

    const signup = async (values) => {

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });
    
            if (!response.ok) {
                return 1;
            }
            
            const data = await response.json(); // Parse the JSON response
            console.log(data)
            setUser(data)
            setAdmin(data.admin)
            return 0;
           
        } catch (error) {
            return 2;
        }
    }

    const login = async (values) => {
        try {
            const response = await fetch('http://localhost:5000', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });
    
            if (!response.ok) {
                throw new Error('Error in network request');
            }
    
            const data = await response.json(); // Parse the JSON response
            setUser(data)
            setAdmin(data.admin)
            console.log('Server response:', data);
           
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorContext("error.response.data");
        }
    }

    const logout = async () => {

        try {
            const response = await fetch('http://localhost:5000/logout');
    
            if (!response.ok) {
                throw new Error('Error in network request');
            }
            
            setUser(null)
            setAdmin(null)
           
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorContext("error.response.data");
        }
    }

    return(
        <AuthContext.Provider value={{
            user,
            signup,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;