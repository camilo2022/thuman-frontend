import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Locations/Countries/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(countryId) {
        try {
            const response = await axios.get(`${API_URL}/Locations/Countries/Find/${countryId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(countryId, country) {
        try {
            const response = await axios.put(`${API_URL}/Locations/Countries/Setting/${countryId}`, country, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
