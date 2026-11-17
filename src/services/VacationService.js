import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async availability(personId) {
        try {
            const response = await axios.get(`${API_URL}/Vacations/Availability`, { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async all(page = 1, search = '', perPage = null, personId = null, status = null, area_id = null, typeVacation = null, period = null) {
        try {
            const response = await axios.get(`${API_URL}/Vacations/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'status': status, 'area_id': area_id, 'vacation_type_id': typeVacation, 'period': period }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(vacationId) {
        try {
            const response = await axios.get(`${API_URL}/Vacations/Find/${vacationId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(vacation) {
        try {
            const response = await axios.post(`${API_URL}/Vacations/Store`, vacation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(vacationId, vacation) {
        try {
            const response = await axios.post(`${API_URL}/Vacations/Update/${vacationId}`, vacation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(vacationId, vacation) {
        try {
            const response = await axios.patch(`${API_URL}/Vacations/Approved/${vacationId}`, vacation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(vacationId, vacation) {
        try {
            const response = await axios.patch(`${API_URL}/Vacations/Rejected/${vacationId}`, vacation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
