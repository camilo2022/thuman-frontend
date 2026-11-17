import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Enterprises/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(enterpriseId) {
        try {
            const response = await axios.get(`${API_URL}/Enterprises/Find/${enterpriseId}`, { headers: authHeaders()});
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(enterprise) {
        try {
            const formData = new FormData();

            if (enterprise.name) formData.append('name', enterprise.name);
            if (enterprise.description) formData.append('description', enterprise.description);
            if (enterprise.logo instanceof File) formData.append('logo', enterprise.logo, enterprise.logo.name);
            if (enterprise.file_type_id) formData.append('file_type_id', Number(enterprise.file_type_id));
            if (enterprise.file_subtype_id) formData.append('file_subtype_id', Number(enterprise.file_subtype_id));

            const response = await axios.post(`${API_URL}/Enterprises/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(enterpriseId, enterprise) {
        try {
            const formData = new FormData();

            if (enterprise.name) formData.append('name', enterprise.name);
            if (enterprise.description) formData.append('description', enterprise.description);
            if (enterprise.logo instanceof File) formData.append('logo', enterprise.logo, enterprise.logo.name);
            if (enterprise.file_type_id) formData.append('file_type_id', Number(enterprise.file_type_id));
            if (enterprise.file_subtype_id) formData.append('file_subtype_id', Number(enterprise.file_subtype_id));
            
            const response = await axios.post(`${API_URL}/Enterprises/Update/${enterpriseId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(enterpriseId) {
        try {
            const response = await axios.delete(`${API_URL}/Enterprises/Delete/${enterpriseId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(enterpriseId) {
        try {
            const response = await axios.patch(`${API_URL}/Enterprises/Restore/${enterpriseId}`, null, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
