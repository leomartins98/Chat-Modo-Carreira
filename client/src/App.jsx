import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dossier from './pages/Dossier';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

function App() {
    const [token, setToken] = useState(localStorage.getItem('ca_token'));
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem('ca_user');
        return u ? JSON.parse(u) : null;
    });

    const login = (token, user) => {
        localStorage.setItem('ca_token', token);
        localStorage.setItem('ca_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('ca_token');
        localStorage.removeItem('ca_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/auth"
                        element={token ? <Navigate to="/" replace /> : <Auth />}
                    />
                    <Route
                        path="/"
                        element={token ? <Home /> : <Navigate to="/auth" replace />}
                    />
                    <Route
                        path="/dossier"
                        element={token ? <Dossier /> : <Navigate to="/auth" replace />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
