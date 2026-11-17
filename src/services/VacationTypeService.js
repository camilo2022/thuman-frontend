import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/VacationTypes/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(vacationTypeId) {
        try {
            const response = await axios.get(`${API_URL}/VacationTypes/Find/${vacationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(vacationType) {
        try {
            const response = await axios.post(`${API_URL}/VacationTypes/Store`, vacationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(vacationTypeId, vacationType) {
        try {
            const response = await axios.put(`${API_URL}/VacationTypes/Update/${vacationTypeId}`, vacationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(vacationTypeId, vacationType) {
        try {
            const response = await axios.put(`${API_URL}/VacationTypes/Toggle/${vacationTypeId}`, vacationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(vacationTypeId, vacationType) {
        try {
            const response = await axios.put(`${API_URL}/VacationTypes/Setting/${vacationTypeId}`, vacationType, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(vacationTypeId) {
        try {
            const response = await axios.delete(`${API_URL}/VacationTypes/Delete/${vacationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(vacationTypeId) {
        try {
            const response = await axios.patch(`${API_URL}/VacationTypes/Restore/${vacationTypeId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
