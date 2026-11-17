import axios from "axios";
import { API_URL, authHeaders } from "@/config/apiConfig";

export default {
    async all(page = 1, search = '', perPage = null, personId = null, areaId = null, filters = {}, contractTypeId = null, status = null, entity_id = null, headquarter_id = null) {
        try {
            const {withoutAffiliations = false, positionId = null, terminations = false} = filters;
            const response = await axios.get(`${API_URL}/Employees/All?page=${page}`, { params: { search, perPage, 'person_id': personId, 'area_id': areaId, 'without_affiliations': withoutAffiliations, 'position_id': positionId, 'contract_type_id': contractTypeId, 'status': status, 'terminations': terminations, 'entity_id': entity_id, 'headquarter_id': headquarter_id }, headers: authHeaders() });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

  async find(employeeId = null, personId = null) {
    try {
      const response = await axios.get(
        employeeId
          ? `${API_URL}/Employees/Find/${employeeId}`
          : `${API_URL}/Employees/Find`,
        { params: { person_id: personId }, headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
