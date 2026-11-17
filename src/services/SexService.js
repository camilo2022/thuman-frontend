import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Sexes/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(sexId) {
        try {
            const response = await axios.get(`${API_URL}/Sexes/Find/${sexId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
