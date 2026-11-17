import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(moduleId, page = 1, search = '', perPage = null, types = [], filters ={}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Navigations/Modules/Submodules/All/${moduleId}?page=${page}`, { params: { search, perPage, 'types': types, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(submoduleId) {
        try {
            const response = await axios.get(`${API_URL}/Navigations/Modules/Submodules/Find/${submoduleId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(submodule) {
        try {
            const response = await axios.post(`${API_URL}/Navigations/Modules/Submodules/Store`, submodule, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(submoduleId, submodule) {
        try {
            const response = await axios.put(`${API_URL}/Navigations/Modules/Submodules/Update/${submoduleId}`, submodule, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(submoduleId) {
        try {
            const response = await axios.delete(`${API_URL}/Navigations/Modules/Submodules/Delete/${submoduleId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(submoduleId) {
        try {
            const response = await axios.patch(`${API_URL}/Navigations/Modules/Submodules/Restore/${submoduleId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
