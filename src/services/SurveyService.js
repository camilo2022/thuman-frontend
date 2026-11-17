import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, formId = null, formTypeId = null, assignable_type = null, assignable_id = null, model_type = null, model_id = null, personId = null) {
        try {
            const response = await axios.get(`${API_URL}/Surveys/All?page=${page}`, { params: { search, perPage, 'form_id': formId, 'form_type_id': formTypeId, 'assignable_type': assignable_type, 'assignable_id': assignable_id, 'model_type': model_type, 'model_id': model_id, 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(surveyId) {
        try {
            const response = await axios.get(`${API_URL}/Surveys/Find/${surveyId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(survey) {
        try {
            const response = await axios.post(`${API_URL}/Surveys/Store`, survey, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
