import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(profileId, page = 1, search = '', perPage) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/LanguageProficiencies/All/${profileId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(languageProficiencieId) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/LanguageProficiencies/Find/${languageProficiencieId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(languageProficiencie) {
        try {
            const formData = new FormData();
            
            if (languageProficiencie.id) formData.append('id', languageProficiencie.id);
            if (languageProficiencie.profile_id) formData.append('profile_id', languageProficiencie.profile_id);
            if (languageProficiencie.language_id) formData.append('language_id', languageProficiencie.language_id);
            if (languageProficiencie.language_level_id) formData.append('language_level_id', languageProficiencie.language_level_id);

            if (languageProficiencie.file?.file instanceof File) formData.append('file[file]', languageProficiencie.file.file);
            if (languageProficiencie.file?.file_type_id) formData.append('file[file_type_id]', languageProficiencie.file.file_type_id);
            if (languageProficiencie.file?.file_subtype_id) formData.append('file[file_subtype_id]', languageProficiencie.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/LanguageProficiencies/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(languageProficiencieId, languageProficiencie) {
        try {
            const formData = new FormData();
            
            if (languageProficiencie.id) formData.append('id', languageProficiencie.id);
            if (languageProficiencie.profile_id) formData.append('profile_id', languageProficiencie.profile_id);
            if (languageProficiencie.language_id) formData.append('language_id', languageProficiencie.language_id);
            if (languageProficiencie.language_level_id) formData.append('language_level_id', languageProficiencie.language_level_id);

            if (languageProficiencie.file?.file instanceof File) formData.append('file[file]', languageProficiencie.file.file);
            if (languageProficiencie.file?.file_type_id) formData.append('file[file_type_id]', languageProficiencie.file.file_type_id);
            if (languageProficiencie.file?.file_subtype_id) formData.append('file[file_subtype_id]', languageProficiencie.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/LanguageProficiencies/Update/${languageProficiencieId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(languageProficiencieId) {
        try {
            const response = await axios.delete(`${API_URL}/Profiles/LanguageProficiencies/Delete/${languageProficiencieId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
