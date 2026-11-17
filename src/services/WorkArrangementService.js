import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/WorkArrangements/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(workArrangementId) {
        try {
            const response = await axios.get(`${API_URL}/WorkArrangements/Find/${workArrangementId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(workArrangement) {
        try {
            const response = await axios.post(`${API_URL}/WorkArrangements/Store`, workArrangement, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(workArrangementId, workArrangement) {
        try {
            const response = await axios.put(`${API_URL}/WorkArrangements/Update/${workArrangementId}`, workArrangement, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(workArrangementId) {
        try {
            const response = await axios.delete(`${API_URL}/WorkArrangements/Delete/${workArrangementId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(workArrangementId) {
        try {
            const response = await axios.patch(`${API_URL}/WorkArrangements/Restore/${workArrangementId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
