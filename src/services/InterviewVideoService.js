import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async find(interviewVideoId = null, applicationId = null) {
        try {
            const response = await axios.get(interviewVideoId ? `${API_URL}/Vacants/Applications/InterviewVideos/Find/${interviewVideoId}` : `${API_URL}/Vacants/Applications/InterviewVideos/Find` , { params: { 'application_id': applicationId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(interviewVideos) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Applications/InterviewVideos/Store`, interviewVideos, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(interviewVideoId, interviewVideos) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/InterviewVideos/Update/${interviewVideoId}`, interviewVideos, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
