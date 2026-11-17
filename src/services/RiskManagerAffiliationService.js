import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async find(riskManagerAffiliationId = null, personId = null) {
        try {
            const response = await axios.get(riskManagerAffiliationId ? `${API_URL}/RiskManagerAffiliations/Find/${riskManagerAffiliationId}` : `${API_URL}/RiskManagerAffiliations/Find` , { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(riskManagerAffiliation) {
        try {
            const formData = new FormData();

            if (riskManagerAffiliation.person_id) formData.append('person_id', riskManagerAffiliation.person_id);
            if (riskManagerAffiliation.country_id) formData.append('country_id', riskManagerAffiliation.country_id);
            if (riskManagerAffiliation.risk_manager_id) formData.append('risk_manager_id', riskManagerAffiliation.risk_manager_id);

            if (riskManagerAffiliation.file?.file instanceof File) formData.append('file[file]', riskManagerAffiliation.file.file, riskManagerAffiliation.file.file.name);
            if (riskManagerAffiliation.file?.file_type_id) formData.append('file[file_type_id]', riskManagerAffiliation.file.file_type_id);
            if (riskManagerAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', riskManagerAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/RiskManagerAffiliations/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(riskManagerAffiliationId, riskManagerAffiliation) {
        try {
            const formData = new FormData();

            if (riskManagerAffiliation.person_id) formData.append('person_id', riskManagerAffiliation.person_id);
            if (riskManagerAffiliation.country_id) formData.append('country_id', riskManagerAffiliation.country_id);
            if (riskManagerAffiliation.risk_manager_id) formData.append('risk_manager_id', riskManagerAffiliation.risk_manager_id);

            if (riskManagerAffiliation.file?.file instanceof File) formData.append('file[file]', riskManagerAffiliation.file.file, riskManagerAffiliation.file.file.name);
            if (riskManagerAffiliation.file?.file_type_id) formData.append('file[file_type_id]', riskManagerAffiliation.file.file_type_id);
            if (riskManagerAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', riskManagerAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/RiskManagerAffiliations/Update/${riskManagerAffiliationId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async refreshed(riskManagerAffiliationId, riskManagerAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/RiskManagerAffiliations/Refreshed/${riskManagerAffiliationId}`, riskManagerAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(riskManagerAffiliationId, riskManagerAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/RiskManagerAffiliations/Approved/${riskManagerAffiliationId}`, riskManagerAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
