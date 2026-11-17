import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, type = null) {
        try {
            const response = await axios.get(`${API_URL}/Navigations/Modules/All?page=${page}`, { params: { search, perPage, type }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(moduleId) {
        try {
            const response = await axios.get(`${API_URL}/Navigations/Modules/Find/${moduleId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(module) {
        try {
            const response = await axios.post(`${API_URL}/Navigations/Modules/Store`, module, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(moduleId, module) {
        try {
            const response = await axios.put(`${API_URL}/Navigations/Modules/Update/${moduleId}`, module, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(moduleId) {
        try {
            const response = await axios.delete(`${API_URL}/Navigations/Modules/Delete/${moduleId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(moduleId) {
        try {
            const response = await axios.patch(`${API_URL}/Navigations/Modules/Restore/${moduleId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
