import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async find(healthEntityAffiliationId = null, personId = null) {
        try {
            const response = await axios.get(healthEntityAffiliationId ? `${API_URL}/HealthEntityAffiliations/Find/${healthEntityAffiliationId}` : `${API_URL}/HealthEntityAffiliations/Find` , { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(healthEntityAffiliation) {
        try {
            const formData = new FormData();

            if (healthEntityAffiliation.person_id) formData.append('person_id', healthEntityAffiliation.person_id);
            if (healthEntityAffiliation.country_id) formData.append('country_id', healthEntityAffiliation.country_id);
            if (healthEntityAffiliation.health_entity_id) formData.append('health_entity_id', healthEntityAffiliation.health_entity_id);

            if (healthEntityAffiliation.file?.file instanceof File) formData.append('file[file]', healthEntityAffiliation.file.file, healthEntityAffiliation.file.file.name);
            if (healthEntityAffiliation.file?.file_type_id) formData.append('file[file_type_id]', healthEntityAffiliation.file.file_type_id);
            if (healthEntityAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', healthEntityAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/HealthEntityAffiliations/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(healthEntityAffiliationId, healthEntityAffiliation) {
        try {
            const formData = new FormData();

            if (healthEntityAffiliation.person_id) formData.append('person_id', healthEntityAffiliation.person_id);
            if (healthEntityAffiliation.country_id) formData.append('country_id', healthEntityAffiliation.country_id);
            if (healthEntityAffiliation.health_entity_id) formData.append('health_entity_id', healthEntityAffiliation.health_entity_id);

            if (healthEntityAffiliation.file?.file instanceof File) formData.append('file[file]', healthEntityAffiliation.file.file, healthEntityAffiliation.file.file.name);
            if (healthEntityAffiliation.file?.file_type_id) formData.append('file[file_type_id]', healthEntityAffiliation.file.file_type_id);
            if (healthEntityAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', healthEntityAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/HealthEntityAffiliations/Update/${healthEntityAffiliationId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async refreshed(healthEntityAffiliationId, healthEntityAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/HealthEntityAffiliations/Refreshed/${healthEntityAffiliationId}`, healthEntityAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(healthEntityAffiliationId, healthEntityAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/HealthEntityAffiliations/Approved/${healthEntityAffiliationId}`, healthEntityAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
