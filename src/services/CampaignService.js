import axios from "axios";
import { API_URL, authHeaders } from "@/config/apiConfig";

export default {
  async all(allyId, page = 1, search = "", perPage = null, filters = {}) {
    try {
      const { withTrashed = false } = filters;
      const response = await axios.get(
        `${API_URL}/Enterprises/Entities/Allies/Campaigns/All/${allyId}?page=${page}`,
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

  async find(campaignId) {
    try {
      const response = await axios.get(
        `${API_URL}/Enterprises/Entities/Allies/Campaigns/Find/${campaignId}`,
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
        `${API_URL}/Enterprises/Entities/Allies/Campaigns/Store`,
        headquarter,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async update(campaignId, headquarter) {
    try {
      const response = await axios.put(
        `${API_URL}/Enterprises/Entities/Allies/Campaigns/Update/${campaignId}`,
        headquarter,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async delete(campaignId) {
    try {
      const response = await axios.delete(
        `${API_URL}/Enterprises/Entities/Allies/Campaigns/Delete/${campaignId}`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async restore(campaignId) {
    try {
      const response = await axios.patch(
        `${API_URL}/Enterprises/Entities/Allies/Campaigns/Restore/${campaignId}`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
