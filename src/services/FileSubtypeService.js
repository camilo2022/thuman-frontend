import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, fileTypeId) {
        try {
            const response = await axios.get(`${API_URL}/FileSubtypes/All?page=${page}`, { params: { search, perPage, 'file_type_id': fileTypeId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(fileSubtypeId) {
        try {
            const response = await axios.get(`${API_URL}/FileSubtypes/Find/${fileSubtypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
