import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(profileId, page = 1, search = '', perPage) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/ProfessionalSkills/All/${profileId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(languageProficiencieId) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/ProfessionalSkills/Find/${languageProficiencieId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(languageProficiencie) {
        try {
            const response = await axios.post(`${API_URL}/Profiles/ProfessionalSkills/Store`, languageProficiencie, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(languageProficiencieId, languageProficiencie) {
        console.log(languageProficiencie)
        try {
            const response = await axios.put(`${API_URL}/Profiles/ProfessionalSkills/Update/${languageProficiencieId}`, languageProficiencie, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(languageProficiencieId) {
        try {
            const response = await axios.delete(`${API_URL}/Profiles/ProfessionalSkills/Delete/${languageProficiencieId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
