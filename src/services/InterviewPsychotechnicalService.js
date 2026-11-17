import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Vacants/Applications/InterviewPsychotechnicals/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(interviewPsychotechnicalId = null, applicationId = null) {
    try {
        const response = await axios.get(interviewPsychotechnicalId ? `${API_URL}/Vacants/Applications/InterviewPsychotechnicals/Find/${interviewPsychotechnicalId}` : `${API_URL}/Vacants/Applications/InterviewPsychotechnicals/Find` , { params: { 'application_id': applicationId }, headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
    },

    async store(interviewPsychotechnical) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Applications/InterviewPsychotechnicals/Store`, interviewPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(interviewPsychotechnicalId, interviewPsychotechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/InterviewPsychotechnicals/Update/${interviewPsychotechnicalId}`, interviewPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async psychologist(interviewPsychotechnicalId, interviewPsychotechnical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/InterviewPsychotechnicals/Psychologist/${interviewPsychotechnicalId}`, interviewPsychotechnical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
