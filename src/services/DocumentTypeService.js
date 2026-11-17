import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/DocumentTypes/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(documentTypeId) {
        try {
            const response = await axios.get(`${API_URL}/DocumentTypes/Find/${documentTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(documentType) {
        try {
            const response = await axios.post(`${API_URL}/DocumentTypes/Store`, documentType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(documentTypeId, documentType) {
        try {
            const response = await axios.put(`${API_URL}/DocumentTypes/Update/${documentTypeId}`, documentType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(documentTypeId, documentType) {
        try {
            const response = await axios.put(`${API_URL}/DocumentTypes/Setting/${documentTypeId}`, documentType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(documentTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/DocumentTypes/Delete/${documentTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(documentTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/DocumentTypes/Restore/${documentTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
