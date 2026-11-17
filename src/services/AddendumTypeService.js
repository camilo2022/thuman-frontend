import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/AddendumTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(addendumTypeId) {
        try {
            const response = await axios.get(`${API_URL}/AddendumTypes/Find/${addendumTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(addendumType) {
        try {
            const response = await axios.post(`${API_URL}/AddendumTypes/Store`, addendumType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(addendumTypeId, addendumType) {
        try {
            const response = await axios.put(`${API_URL}/AddendumTypes/Update/${addendumTypeId}`, addendumType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(addendumTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/AddendumTypes/Delete/${addendumTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(addendumTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/AddendumTypes/Restore/${addendumTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
