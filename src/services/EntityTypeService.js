import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const { withTrashed = false } = filters;
            const response = await axios.get(`${API_URL}/EntityTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(entityTypeId) {
        try {
            const response = await axios.get(`${API_URL}/EntityTypes/Find/${entityTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(entityType) {
        try {
            const response = await axios.post(`${API_URL}/EntityTypes/Store`, entityType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(entityTypeId, entityType) {
        try {
            const response = await axios.put(`${API_URL}/EntityTypes/Update/${entityTypeId}`, entityType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(entityTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/EntityTypes/Delete/${entityTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(entityTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/EntityTypes/Restore/${entityTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
