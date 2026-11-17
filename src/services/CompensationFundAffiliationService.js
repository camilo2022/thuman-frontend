import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async find(compensationFundAffiliationId = null, personId = null) {
        try {
            const response = await axios.get(compensationFundAffiliationId ? `${API_URL}/CompensationFundAffiliations/Find/${compensationFundAffiliationId}` : `${API_URL}/CompensationFundAffiliations/Find` , { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(compensationFundAffiliation) {
        try {
            const formData = new FormData();

            if (compensationFundAffiliation.person_id) formData.append('person_id', compensationFundAffiliation.person_id);
            if (compensationFundAffiliation.country_id) formData.append('country_id', compensationFundAffiliation.country_id);
            if (compensationFundAffiliation.compensation_fund_id) formData.append('compensation_fund_id', compensationFundAffiliation.compensation_fund_id);

            if (compensationFundAffiliation.file?.file instanceof File) formData.append('file[file]', compensationFundAffiliation.file.file, compensationFundAffiliation.file.file.name);
            if (compensationFundAffiliation.file?.file_type_id) formData.append('file[file_type_id]', compensationFundAffiliation.file.file_type_id);
            if (compensationFundAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', compensationFundAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/CompensationFundAffiliations/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(compensationFundAffiliationId, compensationFundAffiliation) {
        try {
            const formData = new FormData();

            if (compensationFundAffiliation.person_id) formData.append('person_id', compensationFundAffiliation.person_id);
            if (compensationFundAffiliation.country_id) formData.append('country_id', compensationFundAffiliation.country_id);
            if (compensationFundAffiliation.compensation_fund_id) formData.append('compensation_fund_id', compensationFundAffiliation.compensation_fund_id);

            if (compensationFundAffiliation.file?.file instanceof File) formData.append('file[file]', compensationFundAffiliation.file.file, compensationFundAffiliation.file.file.name);
            if (compensationFundAffiliation.file?.file_type_id) formData.append('file[file_type_id]', compensationFundAffiliation.file.file_type_id);
            if (compensationFundAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', compensationFundAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/CompensationFundAffiliations/Update/${compensationFundAffiliationId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async refreshed(compensationFundAffiliationId, compensationFundAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/CompensationFundAffiliations/Refreshed/${compensationFundAffiliationId}`, compensationFundAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(compensationFundAffiliationId, compensationFundAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/CompensationFundAffiliations/Approved/${compensationFundAffiliationId}`, compensationFundAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
