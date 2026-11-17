import axios from 'axios';
import { API_URL, authHeaders } from '@/config/apiConfig';

export default {
    async all(page = 1, search = '', perPage = null, areaId = null, status = null, entityId = null, personId = null, filters = {}) {
        try {
            const {experience = [], workArrangementId = [], enterpriseId = [], contractTypeId = [], salary = [],  countryId = [],  departamentId = [],  cityId = []} = filters;
            const response = await axios.get(`${API_URL}/Vacants/All?page=${page}`, { params: { search, perPage, 'area_id': areaId, 'status': status, 'entity_id': entityId, 'person_id': personId, 'experience': experience, 'work_arrangement_id': workArrangementId, 'enterprise_id': enterpriseId, 'contract_type_id': contractTypeId, 'salary': salary, 'country_id': countryId, 'departament_id': departamentId, 'city_id': cityId }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    

    async find(vacantId = null, vacantUuid = null) {
        try {
            const response = await axios.get(vacantId ? `${API_URL}/Vacants/Find/${vacantId}` : `${API_URL}/Vacants/Find`, { params: { 'vacant_uuid': vacantUuid }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async store(vacant) {
        try {
            const response = await axios.post(`${API_URL}/Vacants/Store`, vacant, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async update(vacantId, vacant) {
        try {
            const response = await axios.put(`${API_URL}/Vacants/Update/${vacantId}`, vacant, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async review(vacantId, vacant) {
        try {
            const response = await axios.patch(`${API_URL}/Vacants/Review/${vacantId}`, vacant, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async approved(vacantId, vacant) {
        try {
            const response = await axios.patch(`${API_URL}/Vacants/Approved/${vacantId}`, vacant, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async rejected(vacantId, vacant) {
        try {
            const response = await axios.patch(`${API_URL}/Vacants/Rejected/${vacantId}`, vacant, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async published(vacantId, vacant) {
        try {
            const response = await axios.patch(`${API_URL}/Vacants/Published/${vacantId}`, vacant, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async finished(vacantId, vacant) {
        try {
            const response = await axios.patch(`${API_URL}/Vacants/Finished/${vacantId}`, vacant, { headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
