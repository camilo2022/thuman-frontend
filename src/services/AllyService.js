import axios from "axios";
import { API_URL, authHeaders } from "@/config/apiConfig";

export default {
  async all(entityId, page = 1, search = "", perPage = null, filters = {}) {
    try {
      const { withTrashed = false } = filters;
      const response = await axios.get(
        `${API_URL}/Enterprises/Entities/Allies/All/${entityId}?page=${page}`,
        {
          params: { search, perPage, with_trashed: withTrashed },
          headers: authHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async find(allieId) {
    try {
      const response = await axios.get(
        `${API_URL}/Enterprises/Entities/Allies/Find/${allieId}`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async store(headquarter) {
    try {
      const response = await axios.post(
        `${API_URL}/Enterprises/Entities/Allies/Store`,
        headquarter,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async update(allieId, headquarter) {
    try {
      const response = await axios.put(
        `${API_URL}/Enterprises/Entities/Allies/Update/${allieId}`,
        headquarter,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async delete(allieId) {
    try {
      const response = await axios.delete(
        `${API_URL}/Enterprises/Entities/Allies/Delete/${allieId}`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async restore(allieId) {
    try {
      const response = await axios.patch(
        `${API_URL}/Enterprises/Entities/Allies/Restore/${allieId}`,
        null,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
