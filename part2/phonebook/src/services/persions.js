import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    return response.data;
  });
};

const create = (newPersions) => {
  const request = axios.post(baseUrl, newPersions);
  return request.then((response) => response.data);
};

const update = (newPersions) => {
  const request = axios.put(`${baseUrl}/${newPersions.id}`, newPersions);
  return request.then((response) => response.data);
};

const deleteById = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, create, update, deleteById };
