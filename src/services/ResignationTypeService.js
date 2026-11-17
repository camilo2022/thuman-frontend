import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/ResignationTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(resignationTypeId) {
        try {
            const response = await axios.get(`${API_URL}/ResignationTypes/Find/${resignationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(resignationType) {
        try {
            const response = await axios.post(`${API_URL}/ResignationTypes/Store`, resignationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(resignationTypeId, resignationType) {
        try {
            const response = await axios.put(`${API_URL}/ResignationTypes/Update/${resignationTypeId}`, resignationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(resignationTypeId, resignationType) {
        try {
            const response = await axios.put(`${API_URL}/ResignationTypes/Toggle/${resignationTypeId}`, resignationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(resignationTypeId, resignationType) {
        try {
            const response = await axios.put(`${API_URL}/ResignationTypes/Setting/${resignationTypeId}`, resignationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(resignationTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/ResignationTypes/Delete/${resignationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(resignationTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/ResignationTypes/Restore/${resignationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
