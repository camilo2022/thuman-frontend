import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const { withTrashed = false } = filters;
            const response = await axios.get(`${API_URL}/SeveranceTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(severanceTypeId) {
        try {
            const response = await axios.get(`${API_URL}/SeveranceTypes/Find/${severanceTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(severanceType) {
        try {
            const response = await axios.post(`${API_URL}/SeveranceTypes/Store`, severanceType, { headers: authHeaders() });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(severanceTypeId, severanceType) {
        try {
            const response = await axios.put(`${API_URL}/SeveranceTypes/Update/${severanceTypeId}`, severanceType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(severanceTypeId, severanceType) {
        try {
            const response = await axios.put(`${API_URL}/SeveranceTypes/Toggle/${severanceTypeId}`, severanceType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(severanceTypeId, severanceType) {
        try {
            const response = await axios.put(`${API_URL}/SeveranceTypes/Setting/${severanceTypeId}`, severanceType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(severanceTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/SeveranceTypes/Delete/${severanceTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(severanceTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/SeveranceTypes/Restore/${severanceTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
