import { createContext, useState, useMemo, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {    
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = () => {
        const token = localStorage.getItem('token');

        if(token){
            setLoggedIn(true);
            setUser({username: 'admin'});
            return true;
        }else {
            setLoggedIn(false);
            setUser(null);
            return false;
        }        
    };

    useEffect(() => {
        checkAuth();
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/v1/login', {username, password});

            const { token } = response.data;

            localStorage.setItem('token', token);
            setUser({username});
            setLoggedIn(true);
            return {success: true};
        } catch (error) {
            console.error('Error en login:', error);
            if (error.response?.status === 401) {
                return {
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                };
            }

            return {
                success: false,
                message: 'Error de conexion. Intente de nuevo'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setLoggedIn(false);
    };

    const value = useMemo (() => ({
        user,
        login,
        logout,
        loggedIn,
        checkAuth,
        loading,   
    }), [user, loggedIn, loading]);

    if(loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;