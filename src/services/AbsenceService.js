import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personId = null, status = null, area_id = null) {
        try {
            const response = await axios.get(`${API_URL}/Absences/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'status': status, 'area_id': area_id }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(absenceId) {
        try {
            const response = await axios.get(`${API_URL}/Absences/Find/${absenceId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(absence) {
        try {
            const formData = new FormData();

            if (absence.id) formData.append('id', absence.id);
            if (absence.person_id) formData.append('person_id', absence.person_id);
            if (absence.absence_type_id) formData.append('absence_type_id', absence.absence_type_id);
            if (absence.start_date) formData.append('start_date', absence.start_date);
            if (absence.end_date) formData.append('end_date', absence.end_date);
            if (absence.reason) formData.append('reason', absence.reason);
            if (absence.compensation) formData.append('compensation', absence.compensation);
            if (absence.status) formData.append('status', absence.status);

            if (absence.file?.file instanceof File) formData.append('file[file]', absence.file.file);
            if (absence.file?.file_type_id) formData.append('file[file_type_id]', absence.file.file_type_id);
            if (absence.file?.file_subtype_id) formData.append('file[file_subtype_id]', absence.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Absences/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(absenceId, absence) {
        try {
            const formData = new FormData();

            if (absence.id) formData.append('id', absence.id);
            if (absence.person_id) formData.append('person_id', absence.person_id);
            if (absence.absence_type_id) formData.append('absence_type_id', absence.absence_type_id);
            if (absence.start_date) formData.append('start_date', absence.start_date);
            if (absence.end_date) formData.append('end_date', absence.end_date);
            if (absence.reason) formData.append('reason', absence.reason);
            if (absence.compensation) formData.append('compensation', absence.compensation);
            if (absence.status) formData.append('status', absence.status);

            if (absence.file?.file instanceof File) formData.append('file[file]', absence.file.file);
            if (absence.file?.file_type_id) formData.append('file[file_type_id]', absence.file.file_type_id);
            if (absence.file?.file_subtype_id) formData.append('file[file_subtype_id]', absence.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Absences/Update/${absenceId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(absenceId, absence) {
        try {
            const response = await axios.patch(`${API_URL}/Absences/Approved/${absenceId}`, absence, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(absenceId, absence) {
        try {
            const response = await axios.patch(`${API_URL}/Absences/Rejected/${absenceId}`, absence, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
