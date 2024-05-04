import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification";
import Filter from "./components/Filter";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeAnecdote } from "./reducers/store";

const App = () => {
  const dispatch = useDispatch();
  const notifiMsg = useSelector(({ notifi }) => {
    return notifi;
  });

  useEffect(() => {
    dispatch(initializeAnecdote());
  }, []);

  // useEffect(() => {
  //   anecdoteServer.getAll().then((anecdotes) => {
  //     dispatch(setAnecdote(anecdotes));
  //   });
  // }, []);

  return (
    <div>
      <h2>Anecdotes</h2>
      {notifiMsg !== "" && <Notification />}
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
