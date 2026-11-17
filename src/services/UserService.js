import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Users/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(userId = null, personId = null, employeeId = null) {
        try {
            const response = await axios.get(userId ? `${API_URL}/Users/Find/${userId}` : `${API_URL}/Users/Find` , { params: {'person_id': personId, 'employee_id': employeeId}, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(user) {
        try {
            const response = await axios.post(`${API_URL}/Users/Store`, user, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(userId, user) {
        try {
            const response = await axios.put(`${API_URL}/Users/Update/${userId}`, user, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(userId, user) {
        try {
            const response = await axios.put(`${API_URL}/Users/Toggle/${userId}`, user, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async recoveryEmail(user) {
        try {
            const response = await axios.post(`${API_URL}/Users/Recovery/Email`, user, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async recoveryPhoneNumber(user) {
        try {
            const response = await axios.post(`${API_URL}/Users/Recovery/PhoneNumber`, user, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
