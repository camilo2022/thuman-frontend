import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Vacants/Applications/ExamMedicals/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(examMedicalId = null, applicationId = null) {
    try {
        const response = await axios.get(examMedicalId ? `${API_URL}/Vacants/Applications/ExamMedicals/Find/${examMedicalId}` : `${API_URL}/Vacants/Applications/ExamMedicals/Find` , { params: { 'application_id': applicationId }, headers: authHeaders() });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
    },

    async store(examMedical) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Applications/ExamMedicals/Store`, examMedical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(examMedicalId, examMedical) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/ExamMedicals/Update/${examMedicalId}`, examMedical, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async reviewer(examMedicalId, examMedical) {
        try {

            const formData = new FormData();

            if (examMedical.id) formData.append('id', examMedical.id);
            if (examMedical.application_id) formData.append('application_id', examMedical.application_id);
            if (examMedical.date_time) formData.append('date_time', examMedical.date_time);
            if (examMedical.country_id) formData.append('country_id', examMedical.country_id);
            if (examMedical.departament_id) formData.append('departament_id', examMedical.departament_id);
            if (examMedical.city_id) formData.append('city_id', examMedical.city_id);
            if (examMedical.health_entity_id) formData.append('health_entity_id', examMedical.health_entity_id);
            if (examMedical.address) formData.append('address', examMedical.address);
            if (examMedical.neighborhood) formData.append('neighborhood', examMedical.neighborhood);
            if (examMedical.result) formData.append('result', examMedical.result);
            if (examMedical.indication) formData.append('indication', examMedical.indication);
            if (examMedical.status) formData.append('status', examMedical.status);
            if (examMedical.epidemiological_program_id) formData.append('epidemiological_program_id', examMedical.epidemiological_program_id);
            if (examMedical.description) formData.append('description', examMedical.description);
            if (examMedical.file?.file instanceof File) formData.append('file[file]', examMedical.file.file, examMedical.file.file.name);
            if (examMedical.file?.file_type_id) formData.append('file[file_type_id]', examMedical.file.file_type_id);
            if (examMedical.file?.file_subtype_id) formData.append('file[file_subtype_id]', examMedical.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Vacants/Applications/ExamMedicals/Reviewer/${examMedicalId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
