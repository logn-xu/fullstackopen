import { useState } from "react";

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const Button = ({ handlerClick, text }) => {
  return <button onClick={handlerClick}>{text}</button>;
};

const DisplayVote = ({ vote }) => {
  return <p>has {vote} vote</p>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
  ];

  const [selected, setSelected] = useState(0);
  const [mostSelected, setMostSelected] = useState(0);

  const handlerSelectedClick =
    ({ max }) =>
    () => {
      const result = Math.floor(Math.random() * max);
      // console.log(result);
      setSelected(result);
    };

  const max = anecdotes.length - 1;

  const voteAry = new Uint8Array(anecdotes.length);
  const [vote, setVote] = useState(voteAry);

  const maxVoteAry = ({ newVoteAry }) => {
    const max = Math.max(...newVoteAry);
    // console.log("max", max);
    const maxIndex = newVoteAry.findIndex((val) => val === max);
    // console.log("index", maxIndex);
    setMostSelected(maxIndex);
  };

  const handlerVoteClick =
    ({ selected }) =>
    () => {
      console.log("selected", selected);
      console.log("voteAry", vote);
      const newVoteAry = [...vote];
      newVoteAry[selected] += 1;
      setVote(newVoteAry);
      maxVoteAry({ newVoteAry });
    };

  return (
    <div>
      <Header text="Anecdotes of the day" />
      <div>{anecdotes[selected]}</div>
      <DisplayVote vote={vote[selected]} />
      <br />
      <Button handlerClick={handlerVoteClick({ selected })} text="vote" />
      <Button
        handlerClick={handlerSelectedClick({ max })}
        text="next anecdotes"
      />
      <br />
      <Header text="Anecdotes with most votes" />
      <div>{anecdotes[mostSelected]}</div>
      <DisplayVote vote={vote[mostSelected]} />
    </div>
  );
};

export default App;
