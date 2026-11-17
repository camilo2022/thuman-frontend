import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(profileId, page = 1, search = '', perPage) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/ProfessionalExperiences/All/${profileId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(professionalExperienceId) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/ProfessionalExperiences/Find/${professionalExperienceId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(professionalExperience) {
        try {
            const formData = new FormData();
            
            if (professionalExperience.id) formData.append('id', professionalExperience.id);
            if (professionalExperience.profile_id) formData.append('profile_id', professionalExperience.profile_id);
            if (professionalExperience.company_name) formData.append('company_name', professionalExperience.company_name);
            if (professionalExperience.supervisor_name) formData.append('supervisor_name', professionalExperience.supervisor_name);
            if (professionalExperience.supervisor_dialing_country_id) formData.append('supervisor_dialing_country_id', professionalExperience.supervisor_dialing_country_id);
            if (professionalExperience.supervisor_phone_number) formData.append('supervisor_phone_number', professionalExperience.supervisor_phone_number);
            if (professionalExperience.city_id) formData.append('city_id', professionalExperience.city_id);
            if (professionalExperience.company_address) formData.append('company_address', professionalExperience.company_address);
            if (professionalExperience.start_date) formData.append('start_date', professionalExperience.start_date);
            if (professionalExperience.end_date) formData.append('end_date', professionalExperience.end_date);
            if (professionalExperience.position) formData.append('position', professionalExperience.position);
            if (professionalExperience.work_arrangement_id) formData.append('work_arrangement_id', professionalExperience.work_arrangement_id);
            if (professionalExperience.position_description) formData.append('position_description', professionalExperience.position_description);

            if (professionalExperience.file?.file instanceof File) formData.append('file[file]', professionalExperience.file.file);
            if (professionalExperience.file?.file_type_id) formData.append('file[file_type_id]', professionalExperience.file.file_type_id);
            if (professionalExperience.file?.file_subtype_id) formData.append('file[file_subtype_id]', professionalExperience.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/ProfessionalExperiences/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(professionalExperienceId, professionalExperience) {
        try {
            const formData = new FormData();
            
            if (professionalExperience.id) formData.append('id', professionalExperience.id);
            if (professionalExperience.profile_id) formData.append('profile_id', professionalExperience.profile_id);
            if (professionalExperience.company_name) formData.append('company_name', professionalExperience.company_name);
            if (professionalExperience.supervisor_name) formData.append('supervisor_name', professionalExperience.supervisor_name);
            if (professionalExperience.supervisor_dialing_country_id) formData.append('supervisor_dialing_country_id', professionalExperience.supervisor_dialing_country_id);
            if (professionalExperience.supervisor_phone_number) formData.append('supervisor_phone_number', professionalExperience.supervisor_phone_number);
            if (professionalExperience.city_id) formData.append('city_id', professionalExperience.city_id);
            if (professionalExperience.company_address) formData.append('company_address', professionalExperience.company_address);
            if (professionalExperience.start_date) formData.append('start_date', professionalExperience.start_date);
            if (professionalExperience.end_date) formData.append('end_date', professionalExperience.end_date);
            if (professionalExperience.position) formData.append('position', professionalExperience.position);
            if (professionalExperience.work_arrangement_id) formData.append('work_arrangement_id', professionalExperience.work_arrangement_id);
            if (professionalExperience.position_description) formData.append('position_description', professionalExperience.position_description);

            if (professionalExperience.file?.file instanceof File) formData.append('file[file]', professionalExperience.file.file);
            if (professionalExperience.file?.file_type_id) formData.append('file[file_type_id]', professionalExperience.file.file_type_id);
            if (professionalExperience.file?.file_subtype_id) formData.append('file[file_subtype_id]', professionalExperience.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/ProfessionalExperiences/Update/${professionalExperienceId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(professionalExperienceId) {
        try {
            const response = await axios.delete(`${API_URL}/Profiles/ProfessionalExperiences/Delete/${professionalExperienceId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
