import axios from "axios";
import { API_URL, authHeaders } from "@/config/apiConfig";

export default {
  async all(
    page = 1,
    search = "",
    perPage = null,
    vacantId = null,
    personId = null,
    status = null,
    filters = {},
    area_id = null,
    entity_id = null,
    contract_type_id = null,
  ) {
    try {
      const {
        withoutInterviewInitials = false,
        withoutInterviewPsychotechnicals = false,
        withoutTestTechnicals = false,
        withoutTestPsychotechnicals = false,
        withoutExamMedicals = false,
        withoutExamPolygraphs = false,
        inProcess = false,
      } = filters;
      const response = await axios.get(
        vacantId
          ? `${API_URL}/Vacants/Applications/All/${vacantId}?page=${page}`
          : `${API_URL}/Vacants/Applications/All`,
        {
          params: {
            search,
            perPage,
            person_id: personId,
            status: status,
            without_interview_initials: withoutInterviewInitials,
            without_interview_psychotechnicals:
              withoutInterviewPsychotechnicals,
            without_test_technicals: withoutTestTechnicals,
            without_test_psychotechnicals: withoutTestPsychotechnicals,
            without_exam_medicals: withoutExamMedicals,
            without_exam_polygraphs: withoutExamPolygraphs,
            in_process: inProcess,
            area_id: area_id,
            entity_id: entity_id,
            contract_type_id: contract_type_id,
            headers: authHeaders(),
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async find(applicationId = null, personId = null, vacantId = null) {
    try {
      const response = await axios.get(
        applicationId
          ? `${API_URL}/Vacants/Applications/Find/${applicationId}`
          : `${API_URL}/Vacants/Applications/Find`,
        {
          params: { person_id: personId, vacant_id: vacantId },
          headers: authHeaders(),
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async store(application) {
    try {
      const formData = new FormData();

      if (application.id) formData.append("id", application.id);
      if (application.person_id)
        formData.append("person_id", application.person_id);
      if (application.vacant_id)
        formData.append("vacant_id", application.vacant_id);
      if (application.form_id) formData.append("form_id", application.form_id);
      if (application.questions)
        formData.append("questions", JSON.stringify(application.questions));
      if (application.answers)
        formData.append("answers", JSON.stringify(application.answers));
      if (application.status) formData.append("status", application.status);

      if (application.video?.file instanceof File)
        formData.append("video[file]", application.video.file);
      if (application.video?.file_type_id)
        formData.append("video[file_type_id]", application.video.file_type_id);
      if (application.video?.file_subtype_id)
        formData.append(
          "video[file_subtype_id]",
          application.video.file_subtype_id,
        );

      const response = await axios.post(
        `${API_URL}/Vacants/Applications/Store`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data", ...authHeaders() },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async hiring(applicationId, application) {
    try {
      const response = await axios.patch(
        `${API_URL}/Vacants/Applications/Hiring/${applicationId}`,
        application,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async rejected(applicationId, application) {
    try {
      const response = await axios.patch(
        `${API_URL}/Vacants/Applications/Rejected/${applicationId}`,
        application,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async notifyToken(applicationId) {
    try {
      const response = await axios.post(
        `${API_URL}/Vacants/Applications/Notify/Token/${applicationId}`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async verifyToken(applicationId, code) {
    try {
      const response = await axios.put(
        `${API_URL}/Vacants/Applications/Verify/Token/${applicationId}`,
        { code: code },
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
