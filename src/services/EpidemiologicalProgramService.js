import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/EpidemiologicalPrograms/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(epidemiologicalProgramId) {
        try {
            const response = await axios.get(`${API_URL}/EpidemiologicalPrograms/Find/${epidemiologicalProgramId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(epidemiologicalProgram) {
        try {
            const response = await axios.post(`${API_URL}/EpidemiologicalPrograms/Store`, epidemiologicalProgram, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(epidemiologicalProgramId, epidemiologicalProgram) {
        try {
            const response = await axios.put(`${API_URL}/EpidemiologicalPrograms/Update/${epidemiologicalProgramId}`, epidemiologicalProgram, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(epidemiologicalProgramId) {
        try {
            const response = await axios.delete(`${API_URL}/EpidemiologicalPrograms/Delete/${epidemiologicalProgramId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(epidemiologicalProgramId) {
        try {
            const response = await axios.patch(`${API_URL}/EpidemiologicalPrograms/Restore/${epidemiologicalProgramId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
