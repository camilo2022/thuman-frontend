import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/TerminationTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(terminationTypeId) {
        try {
            const response = await axios.get(`${API_URL}/TerminationTypes/Find/${terminationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(terminationType) {
        try {
            const response = await axios.post(`${API_URL}/TerminationTypes/Store`, terminationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(terminationTypeId, terminationType) {
        try {
            const response = await axios.put(`${API_URL}/TerminationTypes/Update/${terminationTypeId}`, terminationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(terminationTypeId, terminationType) {
        try {
            const response = await axios.put(`${API_URL}/TerminationTypes/Toggle/${terminationTypeId}`, terminationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(terminationTypeId, terminationType) {
        try {
            const response = await axios.put(`${API_URL}/TerminationTypes/Setting/${terminationTypeId}`, terminationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(terminationTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/TerminationTypes/Delete/${terminationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(terminationTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/TerminationTypes/Restore/${terminationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
