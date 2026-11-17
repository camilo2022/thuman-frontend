import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/ContractTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(contractTypeId) {
        try {
            const response = await axios.get(`${API_URL}/ContractTypes/Find/${contractTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(contractType) {
        try {
            const response = await axios.post(`${API_URL}/ContractTypes/Store`, contractType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(contractTypeId, contractType) {
        try {
            const response = await axios.put(`${API_URL}/ContractTypes/Update/${contractTypeId}`, contractType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(contractTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/ContractTypes/Delete/${contractTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(contractTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/ContractTypes/Restore/${contractTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
