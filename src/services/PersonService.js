import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/People/All?page=${page}`, { params: { search, perPage, 'with_trashed': withTrashed }, headers: authHeaders()});
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(personId, person = {}) {
        try {
            const response = await axios.get(personId ? `${API_URL}/People/Find/${personId}` : `${API_URL}/People/Find`, { params: person, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(person, signature = false) {
        try {
            const formData = new FormData();

            if (person.first_name) formData.append('first_name', person.first_name);
            formData.append('second_name', person.second_name);
            if (person.first_last_name) formData.append('first_last_name', person.first_last_name);
            formData.append('second_last_name', person.second_last_name);
            if (person.birth_date) formData.append('birth_date', person.birth_date);

            if (person.birth_city_id) formData.append('birth_city_id', person.birth_city_id);
            if (person.birth_country_id) formData.append('birth_country_id', person.birth_country_id);
            if (person.birth_departament_id) formData.append('birth_departament_id', person.birth_departament_id);

            if (person.document_type_id) formData.append('document_type_id', person.document_type_id);
            if (person.document_issue_city_id) formData.append('document_issue_city_id', person.document_issue_city_id);
            if (person.document_issue_country_id) formData.append('document_issue_country_id', person.document_issue_country_id);
            if (person.document_issue_departament_id) formData.append('document_issue_departament_id', person.document_issue_departament_id);
            if (person.document_number) formData.append('document_number', person.document_number);
            if (person.document_number_confirmation) formData.append('document_number_confirmation', person.document_number_confirmation);
            if (person.document_issue_date) formData.append('document_issue_date', person.document_issue_date);

            if (person.city_id) formData.append('city_id', person.city_id);
            if (person.departament_id) formData.append('departament_id', person.departament_id);
            if (person.country_id) formData.append('country_id', person.country_id);
            if (person.address) formData.append('address', person.address);
            if (person.neighborhood) formData.append('neighborhood', person.neighborhood);

            if (person.dialing_country_id) formData.append('dialing_country_id', person.dialing_country_id);
            if (person.phone_number) formData.append('phone_number', person.phone_number);
            if (person.phone_number_verified_at) formData.append('phone_number_verified_at', person.phone_number_verified_at);
            if (person.email) formData.append('email', person.email);
            if (person.email_verified_at) formData.append('email_verified_at', person.email_verified_at);

            if (person.sex_id) formData.append('sex_id', person.sex_id);
            if (person.gender_id) formData.append('gender_id', person.gender_id);
            if (person.blood_type_id) formData.append('blood_type_id', person.blood_type_id);
            if (person.marital_status_id) formData.append('marital_status_id', person.marital_status_id);
            if (person.person_type_id) formData.append('person_type_id', person.person_type_id);

            if (person.photo?.file instanceof File) formData.append('photo[file]', person.photo.file, person.photo.file.name);
            if (person.photo?.file_type_id) formData.append('photo[file_type_id]', person.photo.file_type_id);
            if (person.photo?.file_subtype_id) formData.append('photo[file_subtype_id]', person.photo.file_subtype_id);

            if (person.file?.file instanceof File) formData.append('file[file]', person.file.file, person.file.file.name);
            if (person.file?.file_type_id) formData.append('file[file_type_id]', person.file.file_type_id);
            if (person.file?.file_subtype_id) formData.append('file[file_subtype_id]', person.file.file_subtype_id);

            if (person.signature?.file instanceof File) {
                formData.append('signature[file]', person.signature.file, person.file.file.name);
            } else if (signature) {
                formData.append('signature[file]', '');
            }

            if (person.signature?.file_type_id) formData.append('signature[file_type_id]', person.signature.file_type_id);
            if (person.signature?.file_subtype_id) formData.append('signature[file_subtype_id]', person.signature.file_subtype_id);

            const response = await axios.post(`${API_URL}/People/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders()} });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(personId, person, data = true) {
        console.log(person.neighborhood);
        try {
            const formData = new FormData();

            if (person.first_name) formData.append('first_name', person.first_name);
            formData.append('second_name', person.second_name);
            if (person.first_last_name) formData.append('first_last_name', person.first_last_name);
            formData.append('second_last_name', person.second_last_name);
            if (person.birth_date) {formData.append('birth_date', person.birth_date)} else if(data) {formData.append('birth_date', '')};

            if (person.birth_city_id) formData.append('birth_city_id', person.birth_city_id);
            if (person.birth_country_id) formData.append('birth_country_id', person.birth_country_id);
            if (person.birth_departament_id) formData.append('birth_departament_id', person.birth_departament_id);

            if (person.document_type_id) formData.append('document_type_id', person.document_type_id);
            if (person.document_issue_city_id) formData.append('document_issue_city_id', person.document_issue_city_id);
            if (person.document_issue_country_id) formData.append('document_issue_country_id', person.document_issue_country_id);
            if (person.document_issue_departament_id) formData.append('document_issue_departament_id', person.document_issue_departament_id);
            if (person.document_number) formData.append('document_number', person.document_number);
            if (person.document_number_confirmation) formData.append('document_number_confirmation', person.document_number_confirmation);
            if (person.document_issue_date) {formData.append('document_issue_date', person.document_issue_date)} else if(data) {formData.append('document_issue_date', '')};

            if (person.city_id) {formData.append('city_id', person.city_id)} else if(data) {formData.append('city_id', '')};
            if (person.departament_id) formData.append('departament_id', person.departament_id);
            if (person.country_id) formData.append('country_id', person.country_id);
            if (person.address) {formData.append('address', person.address)} else if(data) {formData.append('address', '')};
            if (person.neighborhood) {formData.append('neighborhood', person.neighborhood)} else if(data) {formData.append('neighborhood', '')};

            if (person.dialing_country_id) formData.append('dialing_country_id', person.dialing_country_id);
            if (person.phone_number) formData.append('phone_number', person.phone_number);
            if (person.phone_number_verified_at) formData.append('phone_number_verified_at', person.phone_number_verified_at);
            if (person.email) formData.append('email', person.email);
            if (person.email_verified_at) formData.append('email_verified_at', person.email_verified_at);

            if (person.sex_id) {formData.append('sex_id', person.sex_id)} else if(data) {formData.append('sex_id', '')};
            if (person.gender_id) formData.append('gender_id', person.gender_id);
            if (person.blood_type_id) formData.append('blood_type_id', person.blood_type_id);
            console.log(person)
            if (person.marital_status_id) {formData.append('marital_status_id', person.marital_status_id)} else if(data) {formData.append('marital_status_id', '')};
            if (person.person_type_id) formData.append('person_type_id', person.person_type_id);

            if (person.photo?.file instanceof File) formData.append('photo[file]', person.photo.file, person.photo.file.name);
            if (person.photo?.file_type_id) formData.append('photo[file_type_id]', person.photo.file_type_id);
            if (person.photo?.file_subtype_id) formData.append('photo[file_subtype_id]', person.photo.file_subtype_id);

            if (person.file?.file instanceof File) formData.append('file[file]', person.file.file, person.file.file.name);
            if (person.file?.file_type_id) formData.append('file[file_type_id]', person.file.file_type_id);
            if (person.file?.file_subtype_id) formData.append('file[file_subtype_id]', person.file.file_subtype_id);

            if (person.signature?.file instanceof File) formData.append('signature[file]', person.signature.file, person.file.file.name);
            if (person.signature?.file_type_id) formData.append('signature[file_type_id]', person.signature.file_type_id);
            if (person.signature?.file_subtype_id) formData.append('signature[file_subtype_id]', person.signature.file_subtype_id);

            const response = await axios.post(`${API_URL}/People/Update/${personId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders()} });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(personId, person) {
        try {
            const response = await axios.put(`${API_URL}/People/Toggle/${personId}`, person, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(personId) {
        try {
            const response = await axios.delete(`${API_URL}/People/Delete/${personId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(personId) {
        try {
            const response = await axios.patch(`${API_URL}/People/Restore/${personId}`, null, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async notifyEmail(personId) {
        try {
            const response = await axios.post(`${API_URL}/People/Notify/Email/${personId}`, null, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async notifyPhoneNumber(personId) {
        try {
            const response = await axios.post(`${API_URL}/People/Notify/PhoneNumber/${personId}`, null, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async verifyEmail(personId, code) {
        try {
            const response = await axios.put(`${API_URL}/People/Verify/Email/${personId}`, { code }, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async verifyPhoneNumber(personId, code) {
        try {
            const response = await axios.put(`${API_URL}/People/Verify/PhoneNumber/${personId}`, { code }, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
