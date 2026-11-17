import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null) {
        try {
            const response = await axios.get(`${API_URL}/Locations/Departaments/All?page=${page}`, { params: { search, perPage, 'country_id': countryId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(departamentId) {
        try {
            const response = await axios.get(`${API_URL}/Locations/Departaments/Find/${departamentId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(departamentId, departament) {
        try {
            const response = await axios.put(`${API_URL}/Locations/Departaments/Setting/${departamentId}`, departament, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
