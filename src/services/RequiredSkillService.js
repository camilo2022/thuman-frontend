import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(positionId, page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Positions/RequiredSkills/All/${positionId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(requiredSkillId) {
        try {
            const response = await axios.get(`${API_URL}/Positions/RequiredSkills/Find/${requiredSkillId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(requiredSkill) {
        try {
            const response = await axios.post(`${API_URL}/Positions/RequiredSkills/Store`, requiredSkill, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(requiredSkillId, requiredSkill) {
        try {
            const response = await axios.put(`${API_URL}/Positions/RequiredSkills/Update/${requiredSkillId}`, requiredSkill, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(requiredSkillId) {
        try {
            const response = await axios.delete(`${API_URL}/Positions/RequiredSkills/Delete/${requiredSkillId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
