import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, departamentId = null) {
        try {
            const response = await axios.get(`${API_URL}/Locations/Cities/All?page=${page}`, { params: { search, perPage, 'departament_id': departamentId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(cityId) {
        try {
            const response = await axios.get(`${API_URL}/Locations/Cities/Find/${cityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(cityId, city) {
        try {
            const response = await axios.put(`${API_URL}/Locations/Cities/Setting/${cityId}`, city, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
