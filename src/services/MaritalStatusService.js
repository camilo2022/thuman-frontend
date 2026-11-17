import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/MaritalStatuses/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(maritalStatusId) {
        try {
            const response = await axios.get(`${API_URL}/MaritalStatuses/Find/${maritalStatusId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(maritalStatus) {
        try {
            const response = await axios.post(`${API_URL}/MaritalStatuses/Store`, maritalStatus, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(maritalStatusId, maritalStatus) {
        try {
            const response = await axios.put(`${API_URL}/MaritalStatuses/Update/${maritalStatusId}`, maritalStatus, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(maritalStatusId) {
        try {
            const response = await axios.delete(`${API_URL}/MaritalStatuses/Delete/${maritalStatusId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(maritalStatusId) {
        try {
            const response = await axios.patch(`${API_URL}/MaritalStatuses/Restore/${maritalStatusId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
