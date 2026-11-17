import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/RiskManagers/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(RiskManagerId) {
        try {
            const response = await axios.get(`${API_URL}/RiskManagers/Find/${RiskManagerId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(RiskManager) {
        try {
            const response = await axios.post(`${API_URL}/RiskManagers/Store`, RiskManager, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(RiskManagerId, RiskManager) {
        try {
            const response = await axios.put(`${API_URL}/RiskManagers/Update/${RiskManagerId}`, RiskManager, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(RiskManagerId, RiskManager) {
        try {
            const response = await axios.put(`${API_URL}/RiskManagers/Toggle/${RiskManagerId}`, RiskManager, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(RiskManagerId) {
        try {
            const response = await axios.delete(`${API_URL}/RiskManagers/Delete/${RiskManagerId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(RiskManagerId) {
        try {
            const response = await axios.patch(`${API_URL}/RiskManagers/Restore/${RiskManagerId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
