import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const config = {
    headers: { authorization: token },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};

const create = async (blog) => {
  const config = {
    headers: { authorization: token },
  };
  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const addLike = async (blog) => {
  const url = `${baseUrl}/${blog.id}`;
  const config = {
    headers: { authorization: token },
  };
  const like = {
    likes: blog.likes + 1,
  };

  const response = await axios.put(url, like, config);
  return response.data;
};

const removeBlog = async (blog) => {
  const url = `${baseUrl}/${blog.id}`;
  const config = {
    headers: { authorization: token },
  };

  await axios.delete(url, config);
};

export default { getAll, setToken, create, addLike, removeBlog };
