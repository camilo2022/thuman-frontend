import axios from "axios";
import { API_URL, authHeaders } from "@/config/apiConfig";

export default {
  async all(page = 1, search = "", perPage = null, entityId = null, positionId = null, parentPositionId = null, filters = {},) {
    try {
      const { withTrashed = false } = filters;

      const response = await axios.get(`${API_URL}/Enterprises/Entities/OrganizationalStructures/All`,
        {
          params: { page, search, perPage, entity_id: entityId, position_id: positionId, parent_position_id: parentPositionId, with_trashed: withTrashed, },
          headers: authHeaders(),
        },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async find(organizationalStructureId) {
    try {
      const response = await axios.get(`${API_URL}/Enterprises/Entities/OrganizationalStructures/Find/${organizationalStructureId}`,
        { headers: authHeaders() },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async store(organizationalStructure) {
    try {
      const response = await axios.post(`${API_URL}/Enterprises/Entities/OrganizationalStructures/Store`, organizationalStructure,
        { headers: authHeaders() },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async update(organizationalStructureId, organizationalStructure) {
    try {
      const response = await axios.put(`${API_URL}/Enterprises/Entities/OrganizationalStructures/Update/${organizationalStructureId}`, organizationalStructure,
        { headers: authHeaders() },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async approved(organizationalStructureId) {
    try {
      const response = await axios.patch(`${API_URL}/Enterprises/Entities/OrganizationalStructures/Approved/${organizationalStructureId}`, {},
        { headers: authHeaders() },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async rejected(organizationalStructureId) {
    try {
      const response = await axios.patch(`${API_URL}/Enterprises/Entities/OrganizationalStructures/Rejected/${organizationalStructureId}`, {},
        { headers: authHeaders() },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async inactive(organizationalStructureId) {
    try {
      const response = await axios.patch(`${API_URL}/Enterprises/Entities/OrganizationalStructures/Inactive/${organizationalStructureId}`, {},
        { headers: authHeaders() },
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};