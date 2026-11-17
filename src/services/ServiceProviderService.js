import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, serviceTypeId = 353) {
        try {
            const response = await axios.get(`${API_URL}/ServiceProviders/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'service_type_id': serviceTypeId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(serviceProviderId) {
        try {
            const response = await axios.get(`${API_URL}/ServiceProviders/Find/${serviceProviderId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(serviceProvider) {
        try {
            const response = await axios.post(`${API_URL}/ServiceProviders/Store`, serviceProvider, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(serviceProviderId, serviceProvider) {
        try {
            const response = await axios.put(`${API_URL}/ServiceProviders/Update/${serviceProviderId}`, serviceProvider, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(serviceProviderId, serviceProvider) {
        try {
            const response = await axios.put(`${API_URL}/ServiceProviders/Toggle/${serviceProviderId}`, serviceProvider, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(serviceProviderId) {
        try {
            const response = await axios.delete(`${API_URL}/ServiceProviders/Delete/${serviceProviderId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(serviceProviderId) {
        try {
            const response = await axios.patch(`${API_URL}/ServiceProviders/Restore/${serviceProviderId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
