import api from "./axios";

export const listApplications = (params) => api.get("/applications", { params });
export const getApplication = (id) => api.get(`/applications/${id}`);
export const createApplication = (data) => api.post("/applications", data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}/status`, { status });
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export const generateCoverLetter = (id, tone) => api.post(`/applications/${id}/cover-letter/generate`, tone ? { tone } : {});
export const updateCoverLetter = (id, coverLetter) => api.put(`/applications/${id}/cover-letter`, { coverLetter });

export const addRound = (appId, data) => api.post(`/applications/${appId}/rounds`, data);
export const updateRound = (appId, roundId, data) => api.put(`/applications/${appId}/rounds/${roundId}`, data);
export const deleteRound = (appId, roundId) => api.delete(`/applications/${appId}/rounds/${roundId}`);

export const addContact = (appId, data) => api.post(`/applications/${appId}/contacts`, data);
export const updateContact = (appId, contactId, data) => api.put(`/applications/${appId}/contacts/${contactId}`, data);
export const deleteContact = (appId, contactId) => api.delete(`/applications/${appId}/contacts/${contactId}`);
