import axios from 'axios';
import { API_URL } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, personStatus = null, legalRepresentativeStatus = null, area_id = null, entity_id = null, contract_type_id = null) {
        try {
            const response = await axios.get(`${API_URL}/Contracts/All?page=${page}`, { params: { search, perPage, 'person_status':personStatus, 'legal_representative_status':legalRepresentativeStatus, 'area_id': area_id, 'entity_id': entity_id, 'contract_type_id': contract_type_id } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(contractId = null, applicationId = null, personId = null) {
        try {
            const response = await axios.get(contractId ? `${API_URL}/Contracts/Find/${contractId}` : `${API_URL}/Contracts/Find`, { params: { 'application_id': applicationId, 'person_id': personId } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(contract) {
        try {
            const response = await axios.post(`${API_URL}/Contracts/Store`, contract);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(contractId, contract) {
        try {
            const response = await axios.put(`${API_URL}/Contracts/Update/${contractId}`, contract);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async preview(contractId) {
        try {
            const response = await axios.get(`${API_URL}/Contracts/Preview/${contractId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async withdrawned(contractId, contract) {
        try {
            const response = await axios.patch(`${API_URL}/Contracts/Withdrawned/${contractId}`, contract);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async refreshed(contractId, contract) {
        try {
            const response = await axios.patch(`${API_URL}/Contracts/Refreshed/${contractId}`, contract);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(contractId, contract) {
        try {
            const response = await axios.patch(`${API_URL}/Contracts/Approved/${contractId}`, contract);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(contractId, contract) {
        try {
            const response = await axios.patch(`${API_URL}/Contracts/Rejected/${contractId}`, contract);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async signedLegalRepresentative(contractId, contract) {
        try {
            const response = await axios.post(`${API_URL}/Contracts/Signed/LegalRepresentative/${contractId}`, contract);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async signedPerson(contractId, contract) {
        try {
            
            const formData = new FormData();

            if (contract.application_id) formData.append('application_id', contract.application_id);
            if (contract.person_id) formData.append('person_id', contract.person_id);
            if (contract.headquarter_id) formData.append('headquarter_id', contract.headquarter_id);
            if (contract.template_id) formData.append('template_id', contract.template_id);
            if (contract.contract_type_id) formData.append('contract_type_id', contract.contract_type_id);
            if (contract.position_id) formData.append('position_id', contract.position_id);
            if (contract.salary) formData.append('salary', contract.salary);
            if (contract.payment_period_id) formData.append('payment_period_id', contract.payment_period_id);
            if (contract.start_date) formData.append('start_date', contract.start_date);
            if (contract.end_date) formData.append('end_date', contract.end_date);
            if (contract.person_observation) formData.append('person_observation', contract.person_observation);
            if (contract.person_signed_at) formData.append('person_signed_at', contract.person_signed_at);
            if (contract.person_status) formData.append('person_status', contract.person_status);
            if (contract.legal_representative_signed_at) formData.append('legal_representative_signed_at', contract.legal_representative_signed_at);
            if (contract.legal_representative_status) formData.append('legal_representative_status', contract.legal_representative_status);
            if (contract.settings) formData.append('settings', JSON.stringify(contract.settings));

            if (contract.signature?.file instanceof File) formData.append('signature[file]', contract.signature.file, contract.signature.file.name);
            if (contract.signature?.file_type_id) formData.append('signature[file_type_id]', contract.signature.file_type_id);
            if (contract.signature?.file_subtype_id) formData.append('signature[file_subtype_id]', contract.signature.file_subtype_id);

            const response = await axios.post(`${API_URL}/Contracts/Signed/Person/${contractId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async notifyToken(contractId = null, applicationId = null) {
        try {
            const response = await axios.post(contractId ? `${API_URL}/Contracts/Notify/Token/${contractId}` : `${API_URL}/Contracts/Notify/Token`, { 'application_id': applicationId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async verifyToken(contractId, code) {
        try {
            const response = await axios.put(`${API_URL}/Contracts/Verify/Token/${contractId}`, { 'code': code });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
