import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Banks/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(bankId) {
        try {
            const response = await axios.get(`${API_URL}/Banks/Find/${bankId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(bank) {
        try {
            const response = await axios.post(`${API_URL}/Banks/Store`, bank, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(bankId, bank) {
        try {
            const response = await axios.put(`${API_URL}/Banks/Update/${bankId}`, bank, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(bankId, bank) {
        try {
            const response = await axios.put(`${API_URL}/Banks/Toggle/${bankId}`, bank, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(bankId) {
        try {
            const response = await axios.delete(`${API_URL}/Banks/Delete/${bankId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(bankId) {
        try {
            const response = await axios.patch(`${API_URL}/Banks/Restore/${bankId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
