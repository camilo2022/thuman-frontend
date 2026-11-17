import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const { withTrashed = false } = filters;
            const response = await axios.get(`${API_URL}/PolicyTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(policyTypeId) {
        try {
            const response = await axios.get(`${API_URL}/PolicyTypes/Find/${policyTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(policyType) {
        try {
            const response = await axios.post(`${API_URL}/PolicyTypes/Store`, policyType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(policyTypeId, policyType) {
        try {
            const response = await axios.put(`${API_URL}/PolicyTypes/Update/${policyTypeId}`, policyType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(policyTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/PolicyTypes/Delete/${policyTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(policyTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/PolicyTypes/Restore/${policyTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
