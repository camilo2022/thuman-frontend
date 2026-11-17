import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(contractId = null, page = 1, search = '', perPage = null) {
        try {
            const response = await axios.get(`${API_URL}/Contracts/Policies/All/${contractId}`, {
                headers: authHeaders(), params: { page, search, perPage, },
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async find(policyId) {
        try {
            const response = await axios.get(`${API_URL}/Contracts/Policies/Find/${policyId}`, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

async store(policy) {
    try {
        const formData = new FormData();

        if (policy.id) formData.append('id', policy.id);
        // if (policy.uuid) formData.append('uuid', policy.uuid);

        if (policy.model_type) formData.append('model_type', policy.model_type);
        if (policy.model_id !== null && policy.model_id !== undefined) {
            formData.append('model_id', policy.model_id);
        }
        if (policy.risk_manager_id) formData.append('risk_manager_id', policy.risk_manager_id);
        if (policy.policy_type_id) formData.append('policy_type_id', policy.policy_type_id);
        if (policy.position !== null) formData.append('position', policy.position);
        if (policy.code) formData.append('code', policy.code);
        if (policy.value !== null) formData.append('value', policy.value);
        if (policy.insured_value !== null) formData.append('insured_value', policy.insured_value);
        if (policy.start_date) formData.append('start_date', policy.start_date);
        if (policy.end_date) formData.append('end_date', policy.end_date);
        if (policy.status) formData.append('status', policy.status);

        if (policy.file?.file instanceof File) {
            formData.append('file[file]', policy.file.file);
        }

        if (policy.file?.file_type_id) {
            formData.append('file[file_type_id]', policy.file.file_type_id);
        }

        if (policy.file?.file_subtype_id) {
            formData.append('file[file_subtype_id]', policy.file.file_subtype_id);
        }

        const response = await axios.post(
            `${API_URL}/Contracts/Policies/Store`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...authHeaders()
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
};