import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Vacants/Applications/InterviewInitials/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(interviewInitialId = null, applicationId = null) {
        try {
            const response = await axios.get(interviewInitialId ? `${API_URL}/Vacants/Applications/InterviewInitials/Find/${interviewInitialId}` : `${API_URL}/Vacants/Applications/InterviewInitials/Find` , { params: { 'application_id': applicationId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(interviewInitial) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Applications/InterviewInitials/Store`, interviewInitial, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(interviewInitialId, interviewInitial) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/InterviewInitials/Update/${interviewInitialId}`, interviewInitial, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async reviewer(interviewInitialId, interviewInitial) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/InterviewInitials/Reviewer/${interviewInitialId}`, interviewInitial, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async leader(interviewInitialId, interviewInitial) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/InterviewInitials/Leader/${interviewInitialId}`, interviewInitial, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
