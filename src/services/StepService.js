import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(inductionId, page = 1, search = '', perPage = null, personId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/Inductions/Steps/All/${inductionId}?page=${page}`, { params: { search, perPage, 'person_id': personId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(stepId) {
        try {
            const response = await axios.get(`${API_URL}/Inductions/Steps/Find/${stepId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(step) {
        try {
            const formData = new FormData();

            if (step.id) formData.append('id', step.id);
            if (step.induction_id) formData.append('induction_id', step.induction_id);
            if (step.name) formData.append('name', step.name);
            if (step.description) formData.append('description', step.description);
            if (step.form_id) formData.append('form_id', step.form_id);

            if (step.video?.file instanceof File) formData.append('video[file]', step.video.file);
            if (step.video?.file_type_id) formData.append('video[file_type_id]', step.video.file_type_id);
            if (step.video?.file_subtype_id) formData.append('video[file_subtype_id]', step.video.file_subtype_id);

            const response = await axios.post(`${API_URL}/Inductions/Steps/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(stepId, step) {
        try {
            const formData = new FormData();

            if (step.id) formData.append('id', step.id);
            if (step.induction_id) formData.append('induction_id', step.induction_id);
            if (step.name) formData.append('name', step.name);
            if (step.description) formData.append('description', step.description);
            if (step.form_id) formData.append('form_id', step.form_id);

            if (step.video?.file instanceof File) formData.append('video[file]', step.video.file);
            if (step.video?.file_type_id) formData.append('video[file_type_id]', step.video.file_type_id);
            if (step.video?.file_subtype_id) formData.append('video[file_subtype_id]', step.video.file_subtype_id);

            const response = await axios.post(`${API_URL}/Inductions/Steps/Update/${stepId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(stepId) {
        try {
            const response = await axios.delete(`${API_URL}/Inductions/Steps/Delete/${stepId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(stepId) {
        try {
            const response = await axios.patch(`${API_URL}/Inductions/Steps/Restore/${stepId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
