import api from "./axios";

export const listResumes = () => api.get("/resumes");

export const uploadResume = (file, label) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("label", label);
  return api.post("/resumes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const setDefaultResume = (id) => api.put(`/resumes/${id}/default`);
export const deleteResume = (id) => api.delete(`/resumes/${id}`);
