import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/SkillTypes/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(skillTypeId) {
        try {
            const response = await axios.get(`${API_URL}/SkillTypes/Find/${skillTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
