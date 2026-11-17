import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(profileId, page = 1, search = '', perPage) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/AcademicQualifications/All/${profileId}?page=${page}`, { params: { search, perPage }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(academicQualificationId) {
        try {
            const response = await axios.get(`${API_URL}/Profiles/AcademicQualifications/Find/${academicQualificationId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(academicQualification) {
        try {
            const formData = new FormData();
            
            if (academicQualification.id) formData.append('id', academicQualification.id);
            if (academicQualification.profile_id) formData.append('profile_id', academicQualification.profile_id);
            if (academicQualification.city_id) formData.append('city_id', academicQualification.city_id);
            if (academicQualification.academic_level_id) formData.append('academic_level_id', academicQualification.academic_level_id);
            if (academicQualification.academic_institution) formData.append('academic_institution', academicQualification.academic_institution);
            if (academicQualification.academic_title) formData.append('academic_title', academicQualification.academic_title);
            if (academicQualification.formation_status_id) formData.append('formation_status_id', academicQualification.formation_status_id);
            if (academicQualification.start_date) formData.append('start_date', academicQualification.start_date);
            if (academicQualification.end_date) {
                formData.append('end_date', academicQualification.end_date)
            }

            if (academicQualification.file?.file instanceof File) formData.append('file[file]', academicQualification.file.file);
            if (academicQualification.file?.file_type_id) formData.append('file[file_type_id]', academicQualification.file.file_type_id);
            if (academicQualification.file?.file_subtype_id) formData.append('file[file_subtype_id]', academicQualification.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/AcademicQualifications/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(academicQualificationId, academicQualification) {
        try {
            const formData = new FormData();
            
            if (academicQualification.id) formData.append('id', academicQualification.id);
            if (academicQualification.profile_id) formData.append('profile_id', academicQualification.profile_id);
            if (academicQualification.city_id) formData.append('city_id', academicQualification.city_id);
            if (academicQualification.academic_level_id) formData.append('academic_level_id', academicQualification.academic_level_id);
            if (academicQualification.academic_institution) formData.append('academic_institution', academicQualification.academic_institution);
            if (academicQualification.academic_title) formData.append('academic_title', academicQualification.academic_title);
            if (academicQualification.formation_status_id) formData.append('formation_status_id', academicQualification.formation_status_id);
            if (academicQualification.start_date) formData.append('start_date', academicQualification.start_date);
            // if (academicQualification.end_date) formData.append('end_date', academicQualification.end_date);
            if (academicQualification.end_date) {
                formData.append('end_date', academicQualification.end_date)
            }

            if (academicQualification.file?.file instanceof File) formData.append('file[file]', academicQualification.file.file);
            if (academicQualification.file?.file_type_id) formData.append('file[file_type_id]', academicQualification.file.file_type_id);
            if (academicQualification.file?.file_subtype_id) formData.append('file[file_subtype_id]', academicQualification.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/AcademicQualifications/Update/${academicQualificationId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(academicQualificationId) {
        try {
            const response = await axios.delete(`${API_URL}/Profiles/AcademicQualifications/Delete/${academicQualificationId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
