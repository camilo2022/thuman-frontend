import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, formTypeId = null, assignable_type = null, assignable_id = null, model_type = null, model_id = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Forms/All?page=${page}`, { params: { search, perPage, 'form_type_id': formTypeId, 'assignable_type': assignable_type, 'assignable_id': assignable_id, 'model_type': model_type, 'model_id': model_id, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(formId, formTypeId = null, assignable_type = null, assignable_id = null, model_type = null, model_id = null) {
        try {
            const response = await axios.get(formId ? `${API_URL}/Forms/Find/${formId}` : `${API_URL}/Forms/Find`, { params: { 'form_type_id': formTypeId, 'assignable_type': assignable_type, 'assignable_id': assignable_id, 'model_type': model_type, 'model_id': model_id }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(form) {
        try {
            const response = await axios.post(`${API_URL}/Forms/Store`, form, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(formId, form) {
        try {
            const response = await axios.put(`${API_URL}/Forms/Update/${formId}`, form, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(formId, form) {
        try {
            const response = await axios.put(`${API_URL}/Forms/Toggle/${formId}`, form, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(formId) {
        try {
            const response = await axios.delete(`${API_URL}/Forms/Delete/${formId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(formId) {
        try {
            const response = await axios.patch(`${API_URL}/Forms/Restore/${formId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
