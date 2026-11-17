import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/HealthEntities/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(healthEntityId) {
        try {
            const response = await axios.get(`${API_URL}/HealthEntities/Find/${healthEntityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(healthEntity) {
        try {
            const response = await axios.post(`${API_URL}/HealthEntities/Store`, healthEntity, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(healthEntityId, healthEntity) {
        try {
            const response = await axios.put(`${API_URL}/HealthEntities/Update/${healthEntityId}`, healthEntity, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(healthEntityId, healthEntity) {
        try {
            const response = await axios.put(`${API_URL}/HealthEntities/Toggle/${healthEntityId}`, healthEntity, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(healthEntityId) {
        try {
            const response = await axios.delete(`${API_URL}/HealthEntities/Delete/${healthEntityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(healthEntityId) {
        try {
            const response = await axios.patch(`${API_URL}/HealthEntities/Restore/${healthEntityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
