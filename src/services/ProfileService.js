import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {

    async find(profileId, personId = null) {
        try {
            const response = await axios.get(profileId ? `${API_URL}/Profiles/Find/${profileId}` : `${API_URL}/Profiles/Find` , { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(profile) {
        try {
            const formData = new FormData();

            formData.append('person_id', profile.person_id);
            formData.append('title', profile.title);
            formData.append('description', profile.description);

            if (profile.file && profile.file.file instanceof File) formData.append('file[file]', profile.file.file);
            formData.append('file[file_type_id]', profile.file.file_type_id);
            formData.append('file[file_subtype_id]', profile.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(profileId, profile) {
        try {
            const formData = new FormData();

            formData.append('person_id', profile.person_id);
            formData.append('title', profile.title);
            formData.append('description', profile.description);

            if (profile.file && profile.file.file instanceof File) formData.append('file[file]', profile.file.file);
            formData.append('file[file_type_id]', profile.file.file_type_id);
            formData.append('file[file_subtype_id]', profile.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Profiles/Update/${profileId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
