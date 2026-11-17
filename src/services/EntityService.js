import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(enterpriseId = null, page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false, entityId = [], countryId = []} = filters;
            const response = await axios.get(enterpriseId ? `${API_URL}/Enterprises/Entities/All/${enterpriseId}?page=${page}` : `${API_URL}/Enterprises/Entities/All` , { params: { search, perPage, 'with_trashed': withTrashed, 'enterprise_id': entityId, 'country_id': countryId  }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(entityId) {
        try {
            const response = await axios.get(`${API_URL}/Enterprises/Entities/Find/${entityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(entity) {
        try {
            const response = await axios.post(`${API_URL}/Enterprises/Entities/Store`, entity, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(entityId, entity) {
        try {
            const response = await axios.put(`${API_URL}/Enterprises/Entities/Update/${entityId}`, entity, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async profile(entityId, entity) {
        try {
            const formData = new FormData();

            if (entity.banner.image instanceof File) formData.append('banner[image]', entity.banner.image);
            if (entity.banner.file_type_id) formData.append('banner[file_type_id]', entity.banner.file_type_id);
            if (entity.banner.file_subtype_id) formData.append('banner[file_subtype_id]', entity.banner.file_subtype_id);

            if (entity.mission.text) formData.append('mission[text]', entity.mission.text);
            if (entity.mission.image instanceof File) formData.append('mission[image]', entity.mission.image);
            if (entity.mission.file_type_id) formData.append('mission[file_type_id]', entity.mission.file_type_id);
            if (entity.mission.file_subtype_id) formData.append('mission[file_subtype_id]', entity.mission.file_subtype_id);

            if (entity.vision.text) formData.append('vision[text]', entity.vision.text);
            if (entity.vision.image instanceof File) formData.append('vision[image]', entity.vision.image);
            if (entity.vision.file_type_id) formData.append('vision[file_type_id]', entity.vision.file_type_id);
            if (entity.vision.file_subtype_id) formData.append('vision[file_subtype_id]', entity.vision.file_subtype_id);

            if (entity.about_us.text) formData.append('about_us[text]', entity.about_us.text);
            if (entity.about_us.image instanceof File) formData.append('about_us[image]', entity.about_us.image);
            if (entity.about_us.file_type_id) formData.append('about_us[file_type_id]', entity.about_us.file_type_id);
            if (entity.about_us.file_subtype_id) formData.append('about_us[file_subtype_id]', entity.about_us.file_subtype_id);

            const response = await axios.post(`${API_URL}/Enterprises/Entities/Profile/${entityId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(entityId) {
        try {
            const response = await axios.delete(`${API_URL}/Enterprises/Entities/Delete/${entityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(entityId) {
        try {
            const response = await axios.patch(`${API_URL}/Enterprises/Entities/Restore/${entityId}`, null, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
