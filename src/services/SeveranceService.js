import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personId = null, status = null, area_id = null) {
        try {
            const response = await axios.get(`${API_URL}/Severances/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'status': status, 'area_id': area_id }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(severanceId) {
        try {
            const response = await axios.get(`${API_URL}/Severances/Find/${severanceId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(severance) {
        try {
            const formData = new FormData();

            if (severance.id) formData.append('id', severance.id);
            if (severance.person_id) formData.append('person_id', severance.person_id);
            if (severance.severance_type_id) formData.append('severance_type_id', severance.severance_type_id);
            if (severance.reason) formData.append('reason', severance.reason);
            if (severance.status) formData.append('status', severance.status);

            if (severance.file?.file instanceof File) formData.append('file[file]', severance.file.file);
            if (severance.file?.file_type_id) formData.append('file[file_type_id]', severance.file.file_type_id);
            if (severance.file?.file_subtype_id) formData.append('file[file_subtype_id]', severance.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Severances/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(severanceId, severance) {
        try {
            const formData = new FormData();

            if (severance.id) formData.append('id', severance.id);
            if (severance.person_id) formData.append('person_id', severance.person_id);
            if (severance.severance_type_id) formData.append('severance_type_id', severance.severance_type_id);
            if (severance.reason) formData.append('reason', severance.reason);
            if (severance.status) formData.append('status', severance.status);

            if (severance.file?.file instanceof File) formData.append('file[file]', severance.file.file);
            if (severance.file?.file_type_id) formData.append('file[file_type_id]', severance.file.file_type_id);
            if (severance.file?.file_subtype_id) formData.append('file[file_subtype_id]', severance.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Severances/Update/${severanceId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(severanceId, severance) {
        try {
            const response = await axios.patch(`${API_URL}/Severances/Approved/${severanceId}`, severance, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(severanceId, severance) {
        try {
            const response = await axios.patch(`${API_URL}/Severances/Rejected/${severanceId}`, severance, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
