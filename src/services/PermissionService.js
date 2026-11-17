import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, roleId = null, permissionId = null) {
        try {
            const response = await axios.get(`${API_URL}/Authorization/Permissions/All?page=${page}`, { params: { search, perPage, 'role_id': roleId, 'permission_id': permissionId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(permissionId) {
        try {
            const response = await axios.get(`${API_URL}/Authorization/Permissions/Find/${permissionId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(permission) {
        try {
            const response = await axios.post(`${API_URL}/Authorization/Permissions/Store`, permission, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(permissionId, permission) {
        try {
            const response = await axios.put(`${API_URL}/Authorization/Permissions/Update/${permissionId}`, permission, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
