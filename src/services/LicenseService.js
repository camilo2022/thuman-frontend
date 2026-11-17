import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personId = null, status = null, area_id = null) {
        try {
            const response = await axios.get(`${API_URL}/Licenses/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'status': status, 'area_id': area_id }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(licenseId) {
        try {
            const response = await axios.get(`${API_URL}/Licenses/Find/${licenseId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(license) {
        try {
            const formData = new FormData();

            if (license.id) formData.append('id', license.id);
            if (license.person_id) formData.append('person_id', license.person_id);
            if (license.license_type_id) formData.append('license_type_id', license.license_type_id);
            if (license.start_date) formData.append('start_date', license.start_date);
            if (license.end_date) formData.append('end_date', license.end_date);
            if (license.reason) formData.append('reason', license.reason);
            if (license.status) formData.append('status', license.status);

            if (license.file?.file instanceof File) formData.append('file[file]', license.file.file);
            if (license.file?.file_type_id) formData.append('file[file_type_id]', license.file.file_type_id);
            if (license.file?.file_subtype_id) formData.append('file[file_subtype_id]', license.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Licenses/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(licenseId, license) {
        try {
            const formData = new FormData();

            if (license.id) formData.append('id', license.id);
            if (license.person_id) formData.append('person_id', license.person_id);
            if (license.license_type_id) formData.append('license_type_id', license.license_type_id);
            if (license.start_date) formData.append('start_date', license.start_date);
            if (license.end_date) formData.append('end_date', license.end_date);
            if (license.reason) formData.append('reason', license.reason);
            if (license.status) formData.append('status', license.status);

            if (license.file?.file instanceof File) formData.append('file[file]', license.file.file);
            if (license.file?.file_type_id) formData.append('file[file_type_id]', license.file.file_type_id);
            if (license.file?.file_subtype_id) formData.append('file[file_subtype_id]', license.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Licenses/Update/${licenseId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(licenseId, license) {
        try {
            const response = await axios.patch(`${API_URL}/Licenses/Approved/${licenseId}`, license, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(licenseId, license) {
        try {
            const response = await axios.patch(`${API_URL}/Licenses/Rejected/${licenseId}`, license, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
