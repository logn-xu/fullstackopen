import { useState, useEffect } from "react";
import axios from "axios";

import persionService from "./services/persions";
import "./index.css";

const Person = ({ search, persons, setPersons }) => {
  const showSearch = persons.filter((person) => {
    return person.name.toLowerCase().startsWith(search.toLowerCase());
  });

  const handleDeleteById = (id) => {
    if (window.confirm("Do you really want to delete?")) {
      console.log(`delete by ${id}`);
      persionService.deleteById(id).then((response) => {
        setPersons(persons.filter((p) => (p.id !== id ? p : null)));
      });
    } else {
      console.log("not delete");
    }
  };

  return showSearch.map((p) => (
    <div key={p.name}>
      {p.name} {p.number}
      <button onClick={() => handleDeleteById(p.id)}>delete</button>
    </div>
  ));
};

const Filter = ({ search, setSearch }) => {
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      debug: {search}
      <ul />
      filter shown with:
      <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const Notification = ({ msg, style }) => {
  if (msg === null) {
    return null;
  }
  return <div className={style}>{msg}</div>;
};

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [msg, setMsg] = useState(null);
  const [styleType, setStyleType] = useState("notifi");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const addName = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: phoneNumber,
    };

    const nameExist = persons.find((p) => p.name === newName);

    if (nameExist) {
      const updatePersonObject = {
        id: nameExist.id,
        name: nameExist.name,
        number: phoneNumber,
      };
      if (window.confirm(`${newName} is already added to phonebook`)) {
        persionService
          .update(updatePersonObject)
          .then((response) => {
            setPersons(
              persons.filter((p) =>
                p.id !== nameExist.id ? p : (p.number = phoneNumber)
              )
            );
          })
          .catch((error) => {
            setMsg(
              `Infomation of ${updatePersonObject.name} has already been removed from server`
            );
            setStyleType("error");
            setTimeout(() => {
              setMsg(null);
            }, 5000);
          });
        setNewName("");
        setPhoneNumber("");
      } else {
        console.log("not update");
      }
    } else {
      persionService
        .create(personObject)
        .then((response) => {
          setPersons(persons.concat(personObject));
        })
        .then(() => {
          setMsg(`Added ${personObject.name}`);
          setStyleType("notifi");
          setTimeout(() => {
            setMsg(null);
          }, 5000);
        })
        .catch((error) => {
          console.log("error", error.response.data.error);
          setMsg(`${error.response.data.error}`);
          setStyleType("error");
          setTimeout(() => {
            setMsg(null);
          }, 5000);
        });
      setNewName("");
      setPhoneNumber("");
    }
  };

  return (
    <div>
      <div>debug: {newName}</div>
      <Notification msg={msg} style={styleType} />
      <form onSubmit={addName}>
        <div>
          Name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Numbers: <input value={phoneNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(
    () =>
      persionService.getAll().then((initDate) => {
        setPersons(initDate);
      }),
    []
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} setSearch={setSearch} />

      <h2>add A New</h2>
      <PersonForm persons={persons} setPersons={setPersons} />

      <h2>Numbers</h2>
      <Person search={search} persons={persons} setPersons={setPersons} />
    </div>
  );
};

export default App;
