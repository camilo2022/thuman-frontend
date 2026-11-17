import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/NotificationChannels/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(notificationChannelId) {
        try {
            const response = await axios.get(`${API_URL}/NotificationChannels/Find/${notificationChannelId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(notificationChannelId, notificationChannel) {
        try {
            const response = await axios.put(`${API_URL}/NotificationChannels/Setting/${notificationChannelId}`, notificationChannel, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
