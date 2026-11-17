import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Inductions/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(inductionId) {
        try {
            const response = await axios.get(`${API_URL}/Inductions/Find/${inductionId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(induction) {
        try {
            const response = await axios.post(`${API_URL}/Inductions/Store`, induction, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(inductionId, induction) {
        try {
            const response = await axios.put(`${API_URL}/Inductions/Update/${inductionId}`, induction, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(inductionId) {
        try {
            const response = await axios.delete(`${API_URL}/Inductions/Delete/${inductionId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(inductionId) {
        try {
            const response = await axios.patch(`${API_URL}/Inductions/Restore/${inductionId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
