import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personId = null, status = null, area_id = null) {
        try {
            const response = await axios.get(`${API_URL}/Resignations/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'status': status, 'area_id': area_id }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(resignationId) {
        try {
            const response = await axios.get(`${API_URL}/Resignations/Find/${resignationId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(resignation) {
        try {
            const response = await axios.post(`${API_URL}/Resignations/Store`, resignation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(resignationId, resignation) {
        try {
            const response = await axios.put(`${API_URL}/Resignations/Update/${resignationId}`, resignation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(resignationId, resignation) {
        try {
            const response = await axios.patch(`${API_URL}/Resignations/Approved/${resignationId}`, resignation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(resignationId, resignation) {
        try {
            const response = await axios.patch(`${API_URL}/Resignations/Rejected/${resignationId}`, resignation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
