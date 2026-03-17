import axios from "axios";

const API = "http://localhost:8080/api/users";

export const getUsers = () => axios.get(API);

export const getUser = (id) => axios.get(`${API}/${id}`);

export const createUser = (data) => axios.post(API, data);

export const updateUser = (id, data) => axios.put(`${API}/${id}`, data);

export const deleteUser = (id) => axios.delete(`${API}/${id}`);

export const getUserRoles = (userId) => axios.get(`${API}/${userId}/roles`);

export const assignRoles = (userId, data) => axios.post(`${API}/${userId}/roles`, data);
