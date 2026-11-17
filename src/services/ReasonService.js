import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(terminationTypeId, page = 1, search = '', perPage = null, filters = {}) {
        try {
            const { withTrashed = false } = filters;
            const response = await axios.get(`${API_URL}/TerminationTypes/Reasons/All/${terminationTypeId}?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(reasonId) {
        try {
            const response = await axios.get(`${API_URL}/TerminationTypes/Reasons/Find/${reasonId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(reason) {
        try {
            const response = await axios.post(`${API_URL}/TerminationTypes/Reasons/Store`, reason, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(reasonId, reason) {
        try {
            const response = await axios.put(`${API_URL}/TerminationTypes/Reasons/Update/${reasonId}`, reason, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(reasonId, reason) {
        try {
            const response = await axios.put(`${API_URL}/TerminationTypes/Reasons/Toggle/${reasonId}`, reason, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(reasonId, reason) {
        try {
            const response = await axios.put(`${API_URL}/TerminationTypes/Reasons/Setting/${reasonId}`, reason, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(reasonId) {
        try {
            const response = await axios.delete(`${API_URL}/TerminationTypes/Reasons/Delete/${reasonId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(reasonId) {
        try {
            const response = await axios.patch(`${API_URL}/TerminationTypes/Reasons/Restore/${reasonId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
