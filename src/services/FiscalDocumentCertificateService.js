import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async find(fiscalDocumentCertificateId = null, personId = null) {
        try {
            const response = await axios.get(fiscalDocumentCertificateId ? `${API_URL}/FiscalDocumentCertificates/Find/${fiscalDocumentCertificateId}` : `${API_URL}/FiscalDocumentCertificates/Find` , { params: { 'person_id': personId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(fiscalDocumentCertificate) {
        try {
            const formData = new FormData();

            if (fiscalDocumentCertificate.person_id) formData.append('person_id', fiscalDocumentCertificate.person_id);
            if (fiscalDocumentCertificate.country_id) formData.append('country_id', fiscalDocumentCertificate.country_id);
            if (fiscalDocumentCertificate.fiscal_document_id) formData.append('fiscal_document_id', fiscalDocumentCertificate.fiscal_document_id);

            if (fiscalDocumentCertificate.file?.file instanceof File) formData.append('file[file]', fiscalDocumentCertificate.file.file, fiscalDocumentCertificate.file.file.name);
            if (fiscalDocumentCertificate.file?.file_type_id) formData.append('file[file_type_id]', fiscalDocumentCertificate.file.file_type_id);
            if (fiscalDocumentCertificate.file?.file_subtype_id) formData.append('file[file_subtype_id]', fiscalDocumentCertificate.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/FiscalDocumentCertificates/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(fiscalDocumentCertificateId, fiscalDocumentCertificate) {
        try {
            const formData = new FormData();

            if (fiscalDocumentCertificate.person_id) formData.append('person_id', fiscalDocumentCertificate.person_id);
            if (fiscalDocumentCertificate.country_id) formData.append('country_id', fiscalDocumentCertificate.country_id);
            if (fiscalDocumentCertificate.fiscal_document_id) formData.append('fiscal_document_id', fiscalDocumentCertificate.fiscal_document_id);

            if (fiscalDocumentCertificate.file?.file instanceof File) formData.append('file[file]', fiscalDocumentCertificate.file.file, fiscalDocumentCertificate.file.file.name);
            if (fiscalDocumentCertificate.file?.file_type_id) formData.append('file[file_type_id]', fiscalDocumentCertificate.file.file_type_id);
            if (fiscalDocumentCertificate.file?.file_subtype_id) formData.append('file[file_subtype_id]', fiscalDocumentCertificate.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/FiscalDocumentCertificates/Update/${fiscalDocumentCertificateId}`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async refreshed(fiscalDocumentCertificateId, fiscalDocumentCertificate) {
        try {
            const response = await axios.patch(`${API_URL}/FiscalDocumentCertificates/Refreshed/${fiscalDocumentCertificateId}`, fiscalDocumentCertificate, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(fiscalDocumentCertificateId, fiscalDocumentCertificate) {
        try {
            const response = await axios.patch(`${API_URL}/FiscalDocumentCertificates/Approved/${fiscalDocumentCertificateId}`, fiscalDocumentCertificate, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
