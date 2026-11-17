import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(positionId, page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Positions/RequiredExperiences/All/${positionId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(requiredExperienceId) {
        try {
            const response = await axios.get(`${API_URL}/Positions/RequiredExperiences/Find/${requiredExperienceId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(requiredExperience) {
        try {
            const response = await axios.post(`${API_URL}/Positions/RequiredExperiences/Store`, requiredExperience, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(requiredExperienceId, requiredExperience) {
        try {
            const response = await axios.put(`${API_URL}/Positions/RequiredExperiences/Update/${requiredExperienceId}`, requiredExperience, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(requiredExperienceId) {
        try {
            const response = await axios.delete(`${API_URL}/Positions/RequiredExperiences/Delete/${requiredExperienceId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
