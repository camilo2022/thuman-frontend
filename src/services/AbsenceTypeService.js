import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/AbsenceTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(absenceTypeId) {
        try {
            const response = await axios.get(`${API_URL}/AbsenceTypes/Find/${absenceTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(absenceType) {
        try {
            const response = await axios.post(`${API_URL}/AbsenceTypes/Store`, absenceType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(absenceTypeId, absenceType) {
        try {
            const response = await axios.put(`${API_URL}/AbsenceTypes/Update/${absenceTypeId}`, absenceType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(absenceTypeId, absenceType) {
        try {
            const response = await axios.put(`${API_URL}/AbsenceTypes/Toggle/${absenceTypeId}`, absenceType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(absenceTypeId, absenceType) {
        try {
            const response = await axios.put(`${API_URL}/AbsenceTypes/Setting/${absenceTypeId}`, absenceType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(absenceTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/AbsenceTypes/Delete/${absenceTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(absenceTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/AbsenceTypes/Restore/${absenceTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
