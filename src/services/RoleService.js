import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Authorization/Roles/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(roleId) {
        try {
            const response = await axios.get(`${API_URL}/Authorization/Roles/Find/${roleId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(role) {
        try {
            const response = await axios.post(`${API_URL}/Authorization/Roles/Store`, role, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(roleId, role) {
        try {
            const response = await axios.put(`${API_URL}/Authorization/Roles/Update/${roleId}`, role, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(roleId, role) {
        try {
            const response = await axios.put(`${API_URL}/Authorization/Roles/Toggle/${roleId}`, role, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
