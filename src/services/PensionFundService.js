import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/PensionFunds/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(pensionFundId) {
        try {
            const response = await axios.get(`${API_URL}/PensionFunds/Find/${pensionFundId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(pensionFund) {
        try {
            const response = await axios.post(`${API_URL}/PensionFunds/Store`, pensionFund, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(pensionFundId, pensionFund) {
        try {
            const response = await axios.put(`${API_URL}/PensionFunds/Update/${pensionFundId}`, pensionFund, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(pensionFundId, pensionFund) {
        try {
            const response = await axios.put(`${API_URL}/PensionFunds/Toggle/${pensionFundId}`, pensionFund);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(pensionFundId) {
        try {
            const response = await axios.delete(`${API_URL}/PensionFunds/Delete/${pensionFundId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(pensionFundId) {
        try {
            const response = await axios.patch(`${API_URL}/PensionFunds/Restore/${pensionFundId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
