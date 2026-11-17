import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/DisabilityTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(disabilityTypeId) {
        try {
            const response = await axios.get(`${API_URL}/DisabilityTypes/Find/${disabilityTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(disabilityType) {
        try {
            const response = await axios.post(`${API_URL}/DisabilityTypes/Store`, disabilityType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(disabilityTypeId, disabilityType) {
        try {
            const response = await axios.put(`${API_URL}/DisabilityTypes/Update/${disabilityTypeId}`, disabilityType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(disabilityTypeId, disabilityType) {
        try {
            const response = await axios.put(`${API_URL}/DisabilityTypes/Toggle/${disabilityTypeId}`, disabilityType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(disabilityTypeId, disabilityType) {
        try {
            const response = await axios.put(`${API_URL}/DisabilityTypes/Setting/${disabilityTypeId}`, disabilityType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(disabilityTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/DisabilityTypes/Delete/${disabilityTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(disabilityTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/DisabilityTypes/Restore/${disabilityTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
