import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async find(pensionFundAffiliationId = null, personId = null) {
        try {
            const response = await axios.get(pensionFundAffiliationId ? `${API_URL}/PensionFundAffiliations/Find/${pensionFundAffiliationId}` : `${API_URL}/PensionFundAffiliations/Find` , { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(pensionFundAffiliation) {
        try {
            const formData = new FormData();

            if (pensionFundAffiliation.person_id) formData.append('person_id', pensionFundAffiliation.person_id);
            if (pensionFundAffiliation.country_id) formData.append('country_id', pensionFundAffiliation.country_id);
            if (pensionFundAffiliation.pension_fund_id) formData.append('pension_fund_id', pensionFundAffiliation.pension_fund_id);

            if (pensionFundAffiliation.file?.file instanceof File) formData.append('file[file]', pensionFundAffiliation.file.file, pensionFundAffiliation.file.file.name);
            if (pensionFundAffiliation.file?.file_type_id) formData.append('file[file_type_id]', pensionFundAffiliation.file.file_type_id);
            if (pensionFundAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', pensionFundAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/PensionFundAffiliations/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(pensionFundAffiliationId, pensionFundAffiliation) {
        try {
            const formData = new FormData();

            if (pensionFundAffiliation.person_id) formData.append('person_id', pensionFundAffiliation.person_id);
            if (pensionFundAffiliation.country_id) formData.append('country_id', pensionFundAffiliation.country_id);
            if (pensionFundAffiliation.pension_fund_id) formData.append('pension_fund_id', pensionFundAffiliation.pension_fund_id);

            if (pensionFundAffiliation.file?.file instanceof File) formData.append('file[file]', pensionFundAffiliation.file.file, pensionFundAffiliation.file.file.name);
            if (pensionFundAffiliation.file?.file_type_id) formData.append('file[file_type_id]', pensionFundAffiliation.file.file_type_id);
            if (pensionFundAffiliation.file?.file_subtype_id) formData.append('file[file_subtype_id]', pensionFundAffiliation.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/PensionFundAffiliations/Update/${pensionFundAffiliationId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async refreshed(pensionFundAffiliationId, pensionFundAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/PensionFundAffiliations/Refreshed/${pensionFundAffiliationId}`, pensionFundAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(pensionFundAffiliationId, pensionFundAffiliation) {
        try {
            const response = await axios.patch(`${API_URL}/PensionFundAffiliations/Approved/${pensionFundAffiliationId}`, pensionFundAffiliation, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
