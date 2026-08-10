// frontend/src/context/AuthContext.js
import  { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on load
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Verify token and get user
            verifyUser();
        } else {
            setLoading(false);
        }
    }, []);

    const verifyUser = async () => {
        try {
            const response = await axios.get('/api/users/profile');
            setUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await axios.post('/api/users/login', {
            email,
            password
        });
        
        const { token, user, dashboardUrl } = response.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const updateProfile = async (data) => {
        const response = await axios.put('/api/users/profile', data);
        setUser(response.data.user);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout, 
            updateProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};