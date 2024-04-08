const Part = (props) => {
  return (
    <div>
      <p>
        {props.name} {props.exercises}
      </p>
    </div>
  );
};

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const Content = ({ id, name, exercises }) => {
  return (
    <div>
      <Part name={name} exercises={exercises} />
    </div>
  );
};

const Total = ({ parts }) => {
  const totalExec = parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      <h2>Total of exercises {totalExec}</h2>
    </div>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      {course.parts.map((prj) => (
        <Content key={prj.id} name={prj.name} exercises={prj.exercises} />
      ))}
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
