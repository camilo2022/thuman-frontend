import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Vacants/Applications/ExamPolygraphs/All?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(examPolygraphId = null, applicationId = null) {
        try {
            const response = await axios.get(examPolygraphId ? `${API_URL}/Vacants/Applications/ExamPolygraphs/Find/${examPolygraphId}` : `${API_URL}/Vacants/Applications/ExamPolygraphs/Find`, { params: { 'application_id': applicationId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(examPolygraph) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Applications/ExamPolygraphs/Store`, examPolygraph, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(examPolygraphId, examPolygraph) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/ExamPolygraphs/Update/${examPolygraphId}`, examPolygraph, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async reviewer(examPolygraphId, examPolygraph) {
        try {

            const formData = new FormData();

            if (examPolygraph.id) formData.append('id', examPolygraph.id);
            if (examPolygraph.application_id) formData.append('application_id', examPolygraph.application_id);
            if (examPolygraph.date_time) formData.append('date_time', examPolygraph.date_time);
            if (examPolygraph.country_id) formData.append('country_id', examPolygraph.country_id);
            if (examPolygraph.departament_id) formData.append('departament_id', examPolygraph.departament_id);
            if (examPolygraph.city_id) formData.append('city_id', examPolygraph.city_id);
            if (examPolygraph.address) formData.append('address', examPolygraph.address);
            if (examPolygraph.neighborhood) formData.append('neighborhood', examPolygraph.neighborhood);
            if (examPolygraph.result) formData.append('result', examPolygraph.result);
            if (examPolygraph.indication) formData.append('indication', examPolygraph.indication);
            if (examPolygraph.status) formData.append('status', examPolygraph.status);
            if (examPolygraph.service_provider_id) formData.append('service_provider_id', examPolygraph.service_provider_id);
            if (examPolygraph.description) formData.append('description', examPolygraph.description);
            if (examPolygraph.file?.file instanceof File) formData.append('file[file]', examPolygraph.file.file, examPolygraph.file.file.name);
            if (examPolygraph.file?.file_type_id) formData.append('file[file_type_id]', examPolygraph.file.file_type_id);
            if (examPolygraph.file?.file_subtype_id) formData.append('file[file_subtype_id]', examPolygraph.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Vacants/Applications/ExamPolygraphs/Reviewer/${examPolygraphId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async leader(examPolygraphId, examPolygraph) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/ExamPolygraphs/Leader/${examPolygraphId}`, examPolygraph, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
