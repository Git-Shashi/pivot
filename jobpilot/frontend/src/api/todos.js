import api from "./axios";

export const listTodos = (applicationId) => api.get("/todos", { params: applicationId ? { applicationId } : {} });
export const createTodo = (data) => api.post("/todos", data);
export const toggleTodo = (id) => api.patch(`/todos/${id}/toggle`);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);
