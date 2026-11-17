import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(entityId, page = 1, search = '', perPage = null, filters = {}) {
        try {
            const { withTrashed = false } = filters;
            const response = await axios.get(`${API_URL}/Enterprises/Entities/Galleries/All/${entityId}?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(galleryId) {
        try {
            const response = await axios.get(`${API_URL}/Enterprises/Entities/Galleries/Find/${galleryId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(gallery) {
        try {
            const formData = new FormData();

            if (gallery.model_id) formData.append('entity_id', Number(gallery.model_id));
            if (gallery.file instanceof File) formData.append('file', gallery.file);
            if (gallery.file_type_id) formData.append('file_type_id', Number(gallery.file_type_id));
            if (gallery.file_subtype_id) formData.append('file_subtype_id', Number(gallery.file_subtype_id));


            const response = await axios.post(`${API_URL}/Enterprises/Entities/Galleries/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(galleryId) {
        try {
            const response = await axios.delete(`${API_URL}/Enterprises/Entities/Galleries/Delete/${galleryId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(galleryId) {
        try {
            const response = await axios.patch(`${API_URL}/Enterprises/Entities/Galleries/Restore/${galleryId}`, null, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async destroy(galleryId) {
        try {
            const response = await axios.delete(`${API_URL}/Enterprises/Entities/Galleries/Destroy/${galleryId}`, null, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
