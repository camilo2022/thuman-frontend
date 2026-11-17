import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Vacants/Applications/TestTechnicals/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(testTechnicalId = null, applicationId = null) {
        try {
            const response = await axios.get(testTechnicalId ? `${API_URL}/Vacants/Applications/TestTechnicals/Find/${testTechnicalId}` : `${API_URL}/Vacants/Applications/TestTechnicals/Find`, { params: { 'application_id': applicationId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(testTechnical) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Applications/TestTechnicals/Store`, testTechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(testTechnicalId, testTechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestTechnicals/Update/${testTechnicalId}`, testTechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async leader(testTechnicalId, testTechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestTechnicals/Leader/${testTechnicalId}`, testTechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async start(testTechnicalId, testTechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestTechnicals/Start/${testTechnicalId}`, testTechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async finish(testTechnicalId, testTechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestTechnicals/Finish/${testTechnicalId}`, testTechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
