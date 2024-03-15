import { useState } from "react";

const Header = () => <h1>give feedback</h1>;

const End = () => <h1>statistics</h1>;

const Nofeedback = () => <h2>No feedback given</h2>;

const Button = (props) => (
  <button onClick={props.handlerClick}>{props.text}</button>
);

const StatisticLine = (props) => {
  return (
    <>
      <td>{props.text}</td>
      <td>
        {props.value} {props.endtext}
      </td>
    </>
  );
};

// a proper place to define a component
const Statistics = (props) => {
  const avg = (props) => {
    if (props.score === 0) {
      return 0;
    }
    return props.score / props.sum;
  };

  if (props.sum === 0) {
    return (
      <div>
        <End />
        <Nofeedback />
      </div>
    );
  }
  return (
    <div>
      <End />
      <table>
        <tr>
          <StatisticLine text="good" value={props.good} />
        </tr>
        <tr>
          <StatisticLine text="neutral" value={props.neutral} />
        </tr>
        <tr>
          <StatisticLine text="bad" value={props.bad} />
        </tr>
        <tr>
          <StatisticLine text="all" value={props.sum} />
        </tr>
        <tr>
          <StatisticLine text="average" value={avg(props)} />
        </tr>
        <tr>
          <StatisticLine
            text="positive"
            value={(props.good / props.sum) * 100}
            endtext="%"
          />
        </tr>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  //   const title = "give feedback"
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [sum, setSum] = useState(0);
  const [score, setScore] = useState(0);

  const handlerGoodClick = () => {
    const newGood = good + 1;
    setGood(newGood);
    setSum(newGood + neutral + bad);
    setScore(score + 1);
  };

  const handlerNeutralClick = () => {
    const newNeutral = neutral + 1;
    setNeutral(newNeutral);
    setSum(good + newNeutral + bad);
  };

  const handlerBadClick = () => {
    const newBad = bad + 1;
    setBad(newBad);
    setSum(good + neutral + newBad);
    setScore(score - 1);
  };

  const result = {
    good,
    neutral,
    bad,
    sum,
    score,
  };

  return (
    <div>
      <Header />
      <Button handlerClick={handlerGoodClick} text="good" />
      <Button handlerClick={handlerNeutralClick} text="neutral" />
      <Button handlerClick={handlerBadClick} text="bad" />
      <Statistics {...result} />
    </div>
  );
};

export default App;
