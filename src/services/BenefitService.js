import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Benefits/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(benefitId) {
        try {
            const response = await axios.get(`${API_URL}/Benefits/Find/${benefitId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(benefit) {
        try {
            const formData = new FormData();

            if (benefit.item_id) formData.append('item_id', benefit.item_id);
            if (benefit.name) formData.append('name', benefit.name);
            if (benefit.description) formData.append('description', benefit.description);
            if (benefit.icon instanceof File) formData.append('icon', benefit.icon, benefit.icon.name);
            if (benefit.file_type_id) formData.append('file_type_id', Number(benefit.file_type_id));
            if (benefit.file_subtype_id) formData.append('file_subtype_id', Number(benefit.file_subtype_id));

            const response = await axios.post(`${API_URL}/Benefits/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(benefitId, benefit) {
        try {
            const formData = new FormData();

            if (benefit.item_id) formData.append('item_id', benefit.item_id);
            if (benefit.name) formData.append('name', benefit.name);
            if (benefit.description) formData.append('description', benefit.description);
            if (benefit.icon instanceof File) formData.append('icon', benefit.icon, benefit.icon.name);
            if (benefit.file_type_id) formData.append('file_type_id', Number(benefit.file_type_id));
            if (benefit.file_subtype_id) formData.append('file_subtype_id', Number(benefit.file_subtype_id));
            
            const response = await axios.post(`${API_URL}/Benefits/Update/${benefitId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(benefitId) {
        try {
            const response = await axios.delete(`${API_URL}/Benefits/Delete/${benefitId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(benefitId) {
        try {
            const response = await axios.patch(`${API_URL}/Benefits/Restore/${benefitId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
