import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {

    async find(CriminalRecordId = null, applicationId = null) {
        try {
            const response = await axios.get(CriminalRecordId ? `${API_URL}/Vacants/Applications/CriminalRecords/Find/${CriminalRecordId}` : `${API_URL}/Vacants/Applications/CriminalRecords/Find` , { params: { 'application_id': applicationId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

     async store(CriminalRecord) {
        try {

            const formData = new FormData();

            if (CriminalRecord.id) formData.append('id', CriminalRecord.id);
            if (CriminalRecord.application_id) formData.append('application_id', CriminalRecord.application_id);
            if (CriminalRecord.status) formData.append('status', CriminalRecord.status);
            if (CriminalRecord.observation) formData.append('observation', CriminalRecord.observation);
            if (CriminalRecord.file?.file instanceof File) formData.append('file[file]', CriminalRecord.file.file, CriminalRecord.file.file.name);
            if (CriminalRecord.file?.file_type_id) formData.append('file[file_type_id]', CriminalRecord.file.file_type_id);
            if (CriminalRecord.file?.file_subtype_id) formData.append('file[file_subtype_id]', CriminalRecord.file.file_subtype_id);

            const response = await axios.post(`${API_URL}/Vacants/Applications/CriminalRecords/Store`, formData, { headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() } } );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(CriminalRecordId, CriminalRecord) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Applications/CriminalRecords/Update/${CriminalRecordId}`, CriminalRecord, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
