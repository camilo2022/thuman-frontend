import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, skillTypeId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Skills/All?page=${page}`, { params: { search, perPage, 'skill_type_id': skillTypeId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(skillId) {
        try {
            const response = await axios.get(`${API_URL}/Skills/Find/${skillId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(skill) {
        try {
            const response = await axios.post(`${API_URL}/Skills/Store`, skill, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(skillId, skill) {
        try {
            const response = await axios.put(`${API_URL}/Skills/Update/${skillId}`, skill, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(skillId) {
        try {
            const response = await axios.delete(`${API_URL}/Skills/Delete/${skillId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(skillId) {
        try {
            const response = await axios.patch(`${API_URL}/Skills/Restore/${skillId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
