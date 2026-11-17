import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personId = null, status = null, area_id = null) {
        try {
            const response = await axios.get(`${API_URL}/Disabilities/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'status': status, 'area_id': area_id }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(disabilityId) {
        try {
            const response = await axios.get(`${API_URL}/Disabilities/Find/${disabilityId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(disability) {
        try {
            const formData = new FormData();

            if (disability.id) formData.append('id', disability.id);
            if (disability.person_id) formData.append('person_id', disability.person_id);
            if (disability.disability_type_id) formData.append('disability_type_id', disability.disability_type_id);
            if (disability.cie_code_id) formData.append('cie_code_id', disability.cie_code_id);
            if (disability.start_date) formData.append('start_date', disability.start_date);
            if (disability.end_date) formData.append('end_date', disability.end_date);
            if (disability.reason) formData.append('reason', disability.reason);
            if (disability.status) formData.append('status', disability.status);

            if (disability.file?.file instanceof File) formData.append('file[file]', disability.file.file);
            if (disability.file?.file_type_id) formData.append('file[file_type_id]', disability.file.file_type_id);
            if (disability.file?.file_subtype_id) formData.append('file[file_subtype_id]', disability.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Disabilities/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(disabilityId, disability) {
        try {
            const formData = new FormData();

            if (disability.id) formData.append('id', disability.id);
            if (disability.person_id) formData.append('person_id', disability.person_id);
            if (disability.disability_type_id) formData.append('disability_type_id', disability.disability_type_id);
            if (disability.cie_code_id) formData.append('cie_code_id', disability.cie_code_id);
            if (disability.start_date) formData.append('start_date', disability.start_date);
            if (disability.end_date) formData.append('end_date', disability.end_date);
            if (disability.reason) formData.append('reason', disability.reason);
            if (disability.status) formData.append('status', disability.status);

            if (disability.file?.file instanceof File) formData.append('file[file]', disability.file.file);
            if (disability.file?.file_type_id) formData.append('file[file_type_id]', disability.file.file_type_id);
            if (disability.file?.file_subtype_id) formData.append('file[file_subtype_id]', disability.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Disabilities/Update/${disabilityId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(disabilityId, disability) {
        try {
            const response = await axios.patch(`${API_URL}/Disabilities/Approved/${disabilityId}`, disability, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(disabilityId, disability) {
        try {
            const response = await axios.patch(`${API_URL}/Disabilities/Rejected/${disabilityId}`, disability, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
