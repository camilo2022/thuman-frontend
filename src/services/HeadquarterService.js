import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(entityId, page = 1, search = '', perPage = null, filters = {}) {
        try {
            const { withTrashed = false } = filters;
            const response = await axios.get(`${API_URL}/Enterprises/Entities/Headquarters/All/${entityId}?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(headquarterId) {
        try {
            const response = await axios.get(`${API_URL}/Enterprises/Entities/Headquarters/Find/${headquarterId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(headquarter) {
        try {
            const response = await axios.post(`${API_URL}/Enterprises/Entities/Headquarters/Store`, headquarter, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(headquarterId, headquarter) {
        try {
            const response = await axios.put(`${API_URL}/Enterprises/Entities/Headquarters/Update/${headquarterId}`, headquarter, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(headquarterId) {
        try {
            const response = await axios.delete(`${API_URL}/Enterprises/Entities/Headquarters/Delete/${headquarterId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(headquarterId) {
        try {
            const response = await axios.patch(`${API_URL}/Enterprises/Entities/Headquarters/Restore/${headquarterId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
