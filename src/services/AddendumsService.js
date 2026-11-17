import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(contractId = null, page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Contracts/Addendums/All/${contractId}`, {
                headers: authHeaders(), params: { page, search, perPage, },
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};