import { useSelector, useDispatch } from "react-redux";
import { setNotification, voteAnecdote } from "../reducers/store";
import { notifiChange } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ anecdote, filter }) => {
    if (filter === "ALL") {
      return anecdote;
    }
    return anecdote.filter((a) => a.content.includes(filter));
  });

  const vote = (id) => {
    const dispalyMsg = anecdotes.find((a) => a.id === id);
    dispatch(voteAnecdote(id));
    dispatch(setNotification(dispalyMsg.content, 1));
    // dispatch(notifiChange(`you voted '${dispalyMsg.content}'`));
    // setTimeout(() => {
    // dispatch(notifiChange(""));
    // }, 5000);
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
