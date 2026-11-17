import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/AcademicLevels/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(academicLevelId) {
        try {
            const response = await axios.get(`${API_URL}/AcademicLevels/Find/${academicLevelId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(academicLevel) {
        try {
            const response = await axios.post(`${API_URL}/AcademicLevels/Store`, academicLevel, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(academicLevelId, academicLevel) {
        try {
            const response = await axios.put(`${API_URL}/AcademicLevels/Update/${academicLevelId}`, academicLevel, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(academicLevelId) {
        try {
            const response = await axios.delete(`${API_URL}/AcademicLevels/Delete/${academicLevelId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(academicLevelId) {
        try {
            const response = await axios.patch(`${API_URL}/AcademicLevels/Restore/${academicLevelId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
