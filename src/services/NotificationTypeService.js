import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/NotificationTypes/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(notificationTypeId) {
        try {
            const response = await axios.get(`${API_URL}/NotificationTypes/Find/${notificationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(notificationTypeId, notificationType) {
        try {
            const response = await axios.put(`${API_URL}/NotificationTypes/Setting/${notificationTypeId}`, notificationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
