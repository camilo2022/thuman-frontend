import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(positionId, page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Positions/Responsabilities/All/${positionId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(responsabilityId) {
        try {
            const response = await axios.get(`${API_URL}/Positions/Responsabilities/Find/${responsabilityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(responsability) {
        try {
            const response = await axios.post(`${API_URL}/Positions/Responsabilities/Store`, responsability, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(responsabilityId, responsability) {
        try {
            const response = await axios.put(`${API_URL}/Positions/Responsabilities/Update/${responsabilityId}`, responsability, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(responsabilityId) {
        try {
            const response = await axios.delete(`${API_URL}/Positions/Responsabilities/Delete/${responsabilityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
