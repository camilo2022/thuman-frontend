import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/CompensationFunds/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(compensationFundId) {
        try {
            const response = await axios.get(`${API_URL}/CompensationFunds/Find/${compensationFundId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(compensationFund) {
        try {
            const response = await axios.post(`${API_URL}/CompensationFunds/Store`, compensationFund, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(compensationFundId, compensationFund) {
        try {
            const response = await axios.put(`${API_URL}/CompensationFunds/Update/${compensationFundId}`, compensationFund, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(compensationFundId, compensationFund) {
        try {
            const response = await axios.put(`${API_URL}/CompensationFunds/Toggle/${compensationFundId}`, compensationFund, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(compensationFundId) {
        try {
            const response = await axios.delete(`${API_URL}/CompensationFunds/Delete/${compensationFundId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(compensationFundId) {
        try {
            const response = await axios.patch(`${API_URL}/CompensationFunds/Restore/${compensationFundId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
