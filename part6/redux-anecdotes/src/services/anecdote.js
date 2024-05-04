import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const object = {
    content: content,
    id: getId(),
    votes: 0,
  };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const voteAction = async (id) => {
  const url = baseUrl + "/" + id;
  const oldResponse = await axios.get(url);
  const newAnecdote = {
    ...oldResponse.data,
    votes: oldResponse.data.votes + 1,
  };
  const response = await axios.put(url, newAnecdote);
  return response.data;
};

export default { getAll, createNew, voteAction };
