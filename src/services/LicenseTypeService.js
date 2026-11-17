import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/LicenseTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(licenseTypeId) {
        try {
            const response = await axios.get(`${API_URL}/LicenseTypes/Find/${licenseTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(licenseType) {
        try {
            const response = await axios.post(`${API_URL}/LicenseTypes/Store`, licenseType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(licenseTypeId, licenseType) {
        try {
            const response = await axios.put(`${API_URL}/LicenseTypes/Update/${licenseTypeId}`, licenseType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(licenseTypeId, licenseType) {
        try {
            const response = await axios.put(`${API_URL}/LicenseTypes/Toggle/${licenseTypeId}`, licenseType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(licenseTypeId, licenseType) {
        try {
            const response = await axios.put(`${API_URL}/LicenseTypes/Setting/${licenseTypeId}`, licenseType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(licenseTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/LicenseTypes/Delete/${licenseTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(licenseTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/LicenseTypes/Restore/${licenseTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
