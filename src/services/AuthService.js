import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async login(login) {
        try {
            const response = await axios.post(`${API_URL}/Login`, login, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al iniciar sesión.' };
        }
    },
    
    async logout(logout) {
        try {
            const response = await axios.post(`${API_URL}/Logout`, logout, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cerrar sesión.' };
        }
    },

    async internalLogin(internalLogin) {
        try {
            const response = await axios.post(`${API_URL}/Internal/Login`, internalLogin, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al iniciar sesión.' };
        }
    },
    
    async internalLogout(internalLogout) {
        try {
            const response = await axios.post(`${API_URL}/Internal/Logout`, internalLogout, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al cerrar sesión.' };
        }
    }
};
