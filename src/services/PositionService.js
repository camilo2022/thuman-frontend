import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, areaId = null, profileCategoryId = null, employeeId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Positions/All?page=${page}`, { params: { search, perPage, 'area_id': areaId, 'profile_category_id': profileCategoryId, 'employee_id': employeeId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(positionId) {
        try {
            const response = await axios.get(`${API_URL}/Positions/Find/${positionId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(position) {
        try {
            const response = await axios.post(`${API_URL}/Positions/Store`, position, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(positionId, position) {
        try {
            const response = await axios.put(`${API_URL}/Positions/Update/${positionId}`, position, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(positionId, position) {
        try {
            const response = await axios.put(`${API_URL}/Positions/Toggle/${positionId}`, position, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(positionId) {
        try {
            const response = await axios.delete(`${API_URL}/Positions/Delete/${positionId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(positionId) {
        try {
            const response = await axios.patch(`${API_URL}/Positions/Restore/${positionId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
