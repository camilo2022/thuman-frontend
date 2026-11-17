import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(positionId, page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Positions/AcademicRequirements/All/${positionId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(academicRequirementId) {
        try {
            const response = await axios.get(`${API_URL}/Positions/AcademicRequirements/Find/${academicRequirementId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(academicRequirement) {
        try {
            const response = await axios.post(`${API_URL}/Positions/AcademicRequirements/Store`, academicRequirement, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(academicRequirementId, academicRequirement) {
        try {
            const response = await axios.put(`${API_URL}/Positions/AcademicRequirements/Update/${academicRequirementId}`, academicRequirement, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(academicRequirementId) {
        try {
            const response = await axios.delete(`${API_URL}/Positions/AcademicRequirements/Delete/${academicRequirementId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
