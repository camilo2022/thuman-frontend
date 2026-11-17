import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Vacants/Applications/TestPsychotechnicals/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(testPsychotechnicalId = null, applicationId = null) {
        try {
            const response = await axios.get(testPsychotechnicalId ? `${API_URL}/Vacants/Applications/TestPsychotechnicals/Find/${testPsychotechnicalId}` : `${API_URL}/Vacants/Applications/TestPsychotechnicals/Find`, { params: { 'application_id': applicationId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(testPsychotechnical) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Applications/TestPsychotechnicals/Store`, testPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(testPsychotechnicalId, testPsychotechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestPsychotechnicals/Update/${testPsychotechnicalId}`, testPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async psychologist(testPsychotechnicalId, testPsychotechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestPsychotechnicals/Psychologist/${testPsychotechnicalId}`, testPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async start(testPsychotechnicalId, testPsychotechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestPsychotechnicals/Start/${testPsychotechnicalId}`, testPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async finish(testPsychotechnicalId, testPsychotechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/TestPsychotechnicals/Finish/${testPsychotechnicalId}`, testPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
