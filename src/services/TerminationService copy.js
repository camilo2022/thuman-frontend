import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personId = null, status = null) {
        try {
            const response = await axios.get(`${API_URL}/Terminations/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'status': status }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(terminationId) {
        try {
            const response = await axios.get(`${API_URL}/Terminations/Find/${terminationId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(termination) {
        try {
            const formData = new FormData();

            if (termination.id) formData.append('id', termination.id);
            if (termination.person_id) formData.append('person_id', termination.person_id);
            if (termination.model_id) formData.append('model_id', termination.model_id);
            if (termination.model_type) formData.append('model_type', termination.model_type);
            if (termination.reason) formData.append('reason', termination.reason);
            if (termination.decision) formData.append('decision', termination.decision);
            if (termination.status) formData.append('status', termination.status);

            if (termination.file?.file instanceof File) formData.append('file[file]', termination.file.file);
            if (termination.file?.file_type_id) formData.append('file[file_type_id]', termination.file.file_type_id);
            if (termination.file?.file_subtype_id) formData.append('file[file_subtype_id]', termination.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Terminations/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(terminationId, termination) {
        try {
            const formData = new FormData();

            if (termination.id) formData.append('id', termination.id);
            if (termination.person_id) formData.append('person_id', termination.person_id);
            if (termination.model_id) formData.append('model_id', termination.model_id);
            if (termination.model_type) formData.append('model_type', termination.model_type);
            if (termination.reason) formData.append('reason', termination.reason);
            if (termination.decision) formData.append('decision', termination.decision);
            if (termination.status) formData.append('status', termination.status);

            if (termination.file?.file instanceof File) formData.append('file[file]', termination.file.file);
            if (termination.file?.file_type_id) formData.append('file[file_type_id]', termination.file.file_type_id);
            if (termination.file?.file_subtype_id) formData.append('file[file_subtype_id]', termination.file.file_subtype_id);
            
            const response = await axios.post(`${API_URL}/Terminations/Update/${terminationId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(terminationId, termination) {
        try {
            const response = await axios.patch(`${API_URL}/Terminations/Approved/${terminationId}`, termination, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(terminationId, termination) {
        try {
            const response = await axios.patch(`${API_URL}/Terminations/Rejected/${terminationId}`, termination, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
