import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/WorkDays/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(workDayId) {
        try {
            const response = await axios.get(`${API_URL}/WorkDays/Find/${workDayId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(workDay) {
        try {
            const response = await axios.post(`${API_URL}/WorkDays/Store`, workDay, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(workDayId, workDay) {
        try {
            const response = await axios.put(`${API_URL}/WorkDays/Update/${workDayId}`, workDay, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(workDayId) {
        try {
            const response = await axios.delete(`${API_URL}/WorkDays/Delete/${workDayId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(workDayId) {
        try {
            const response = await axios.patch(`${API_URL}/WorkDays/Restore/${workDayId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
