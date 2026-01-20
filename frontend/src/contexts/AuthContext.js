import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem('token') || null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const t = localStorage.getItem('token');
		const u = localStorage.getItem('user');
		if (t) {
			setToken(t);
			try {
				setUser(u ? JSON.parse(u) : null);
			} catch (e) {
				setUser(null);
			}
		}
		setLoading(false);
	}, []);

	const loginUser = (newToken, userObj) => {
		setToken(newToken);
		setUser(userObj);
		localStorage.setItem('token', newToken);
		localStorage.setItem('user', JSON.stringify(userObj));
	};

	const logoutUser = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	};

	const registerUser = async (userData) => {
		const res = await apiRegister(userData);
		loginUser(res.data.token, res.data.user);
		return res;
	};

	const loginWithApi = async (credentials) => {
		const res = await apiLogin(credentials);
		loginUser(res.data.token, res.data.user);
		return res;
	};

	return (
		<AuthContext.Provider value={{ user, token, loading, loginUser, logoutUser, registerUser, loginWithApi }}>
			{children}
		</AuthContext.Provider>
	);
};
