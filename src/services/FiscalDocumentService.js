import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, countryId = null, filters = {}) {
        try {
            const {withTrashed = false} = filters;
            const response = await axios.get(`${API_URL}/FiscalDocuments/All?page=${page}`, { params: { search, perPage, 'country_id': countryId, 'with_trashed': withTrashed }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(fiscalDocumentId) {
        try {
            const response = await axios.get(`${API_URL}/FiscalDocuments/Find/${fiscalDocumentId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(fiscalDocument) {
        try {
            const response = await axios.post(`${API_URL}/FiscalDocuments/Store`, fiscalDocument, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(fiscalDocumentId, fiscalDocument) {
        try {
            const response = await axios.put(`${API_URL}/FiscalDocuments/Update/${fiscalDocumentId}`, fiscalDocument, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async toggle(fiscalDocumentId, fiscalDocument) {
        try {
            const response = await axios.put(`${API_URL}/FiscalDocuments/Toggle/${fiscalDocumentId}`, fiscalDocument, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async delete(fiscalDocumentId) {
        try {
            const response = await axios.delete(`${API_URL}/FiscalDocuments/Delete/${fiscalDocumentId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async restore(fiscalDocumentId) {
        try {
            const response = await axios.patch(`${API_URL}/FiscalDocuments/Restore/${fiscalDocumentId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
