import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async find(bankCertificateId = null, personId = null) {
        try {
            const response = await axios.get(bankCertificateId ? `${API_URL}/BankCertificates/Find/${bankCertificateId}` : `${API_URL}/BankCertificates/Find` , { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(bankCertificate) {
        try {
            const formData = new FormData();

            if (bankCertificate.person_id) formData.append('person_id', bankCertificate.person_id);
            if (bankCertificate.country_id) formData.append('country_id', bankCertificate.country_id);
            if (bankCertificate.bank_id) formData.append('bank_id', bankCertificate.bank_id);
            if (bankCertificate.bank_account_type_id) formData.append('bank_account_type_id', bankCertificate.bank_account_type_id);
            if (bankCertificate.account_number) formData.append('account_number', bankCertificate.account_number);

            if (bankCertificate.file?.file instanceof File) formData.append('file[file]', bankCertificate.file.file, bankCertificate.file.file.name);
            if (bankCertificate.file?.file_type_id) formData.append('file[file_type_id]', bankCertificate.file.file_type_id);
            if (bankCertificate.file?.file_subtype_id) formData.append('file[file_subtype_id]', bankCertificate.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/BankCertificates/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(bankCertificateId, bankCertificate) {
        try {
            const formData = new FormData();

            if (bankCertificate.person_id) formData.append('person_id', bankCertificate.person_id);
            if (bankCertificate.country_id) formData.append('country_id', bankCertificate.country_id);
            if (bankCertificate.bank_id) formData.append('bank_id', bankCertificate.bank_id);
            if (bankCertificate.bank_account_type_id) formData.append('bank_account_type_id', bankCertificate.bank_account_type_id);
            if (bankCertificate.account_number) formData.append('account_number', bankCertificate.account_number);

            if (bankCertificate.file?.file instanceof File) formData.append('file[file]', bankCertificate.file.file, bankCertificate.file.file.name);
            if (bankCertificate.file?.file_type_id) formData.append('file[file_type_id]', bankCertificate.file.file_type_id);
            if (bankCertificate.file?.file_subtype_id) formData.append('file[file_subtype_id]', bankCertificate.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/BankCertificates/Update/${bankCertificateId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async refreshed(bankCertificateId, bankCertificate) {
        try {
            const response = await axios.patch(`${API_URL}/BankCertificates/Refreshed/${bankCertificateId}`, bankCertificate, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(bankCertificateId, bankCertificate) {
        try {
            const response = await axios.patch(`${API_URL}/BankCertificates/Approved/${bankCertificateId}`, bankCertificate, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
