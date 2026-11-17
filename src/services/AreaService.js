import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Areas/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(areaId) {
        try {
            const response = await axios.get(`${API_URL}/Areas/Find/${areaId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(area) {
        try {
            const response = await axios.post(`${API_URL}/Areas/Store`, area, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(areaId, area) {
        try {
            const response = await axios.put(`${API_URL}/Areas/Update/${areaId}`, area, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(areaId) {
        try {
            const response = await axios.delete(`${API_URL}/Areas/Delete/${areaId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(areaId) {
        try {
            const response = await axios.patch(`${API_URL}/Areas/Restore/${areaId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
