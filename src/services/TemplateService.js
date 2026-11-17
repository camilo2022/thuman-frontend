import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(entityId, page = 1, search = '', perPage, filters = {}) {
        try {
            const { withTrashed = false } = filters;
            const response = await axios.get(`${API_URL}/Enterprises/Entities/Templates/All/${entityId}?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(templateId = null, entityId = null, fileTypeId = null, fileSubtypeId = null) {
        try {
            const response = await axios.get(templateId ? `${API_URL}/Enterprises/Entities/Templates/Find/${templateId}` : `${API_URL}/Enterprises/Entities/Templates/Find`, { params: { 'entity_id': entityId, 'file_type_id': fileTypeId, 'file_subtype_id': fileSubtypeId, }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(template) {
        try {
            const formData = new FormData();

            formData.append('entity_id', Number(template.model_id));
            if (template.file instanceof File) {
                formData.append('file', template.file);
            }
            formData.append('file_type_id', Number(template.file_type_id));
            formData.append('file_subtype_id', Number(template.file_subtype_id));

            const response = await axios.post(`${API_URL}/Enterprises/Entities/Templates/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(templateId, template) {
        try {
            const formData = new FormData();

            formData.append('entity_id', Number(template.model_id));
            if (template.file instanceof File) {
                formData.append('file', template.file);
            }
            formData.append('file_type_id', Number(template.file_type_id));
            formData.append('file_subtype_id', Number(template.file_subtype_id));

            const response = await axios.post(`${API_URL}/Enterprises/Entities/Templates/Update/${templateId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async setting(templateId, template) {
        try {
            const response = await axios.put(`${API_URL}/Enterprises/Entities/Templates/Setting/${templateId}`, template, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(templateId) {
        try {
            const response = await axios.delete(`${API_URL}/Enterprises/Entities/Templates/Delete/${templateId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(templateId) {
        try {
            const response = await axios.patch(`${API_URL}/Enterprises/Entities/Templates/Restore/${templateId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async preview(templateId) {
        try {
            const response = await axios.get(`${API_URL}/Enterprises/Entities/Templates/Preview/${templateId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
