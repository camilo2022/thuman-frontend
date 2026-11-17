import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {

    async find(progressId = null, personId = null, stepId = null, status = null) {
        try {
            const response = await axios.get(progressId ? `${API_URL}/Progress/Find/${progressId}` : `${API_URL}/Progress/Find` , { params: { 'person_id': personId, 'step_id': stepId, 'status': status }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async start(progress) {
        try {
            const response = await axios.post(`${API_URL}/Progress/Start`, progress, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async finish(progressId, progress) {
        try {
            const response = await axios.put(`${API_URL}/Progress/Finish/${progressId}`, progress, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
