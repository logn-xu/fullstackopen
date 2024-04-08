import { useState, useEffect } from "react";
import axios from "axios";

const ToManySearch = () => {
  return <div>Too Many matches,specify another filter</div>;
};

const Country = ({ countrys }) => {
  const [showCountrysInfo, setShowCountrysInfo] = useState(null);

  const handleShowClicked = (country) => {
    setShowCountrysInfo(country);
  };

  return (
    <div>
      {countrys.map((country) => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleShowClicked(country)}>show</button>
        </div>
      ))}
      {showCountrysInfo && <CountriesInfo countrys={showCountrysInfo} />}
    </div>
  );
};

const CountriesInfo = ({ countrys }) => {
  const { name, capital, area, languages, flags } = countrys;
  return (
    <div>
      <h1>{name.common}</h1>
      <p>
        capital {capital}
        <br />
        area {area}
      </p>
      <p>languages:</p>
      <ul>
        {Object.values(languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <div>
        <img src={flags.png} alt={flags.alt}></img>
      </div>
      <div>
        <h1>Weather in {countrys.name.common}</h1>
        <Weather name={countrys.name.common} />
      </div>
    </div>
  );
};

const Weather = ({ name }) => {
  const [weather, setWeather] = useState("");
  const api_key = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${api_key}`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, []);

  console.log(weather);

  return (
    <div>
      <p>
        temperature {weather && (weather.main.temp - 273.15).toFixed(1)} Celcius
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${
          weather && weather.weather[0].icon
        }@2x.png`}
        alt={weather && weather.weather[0].description}
      ></img>
      <p>wid {weather && weather.wind.speed} m/s</p>
    </div>
  );
};

const Countries = ({ countrys }) => {
  if (countrys.length > 10) {
    return <ToManySearch />;
  } else if (countrys.length > 1) {
    return <Country countrys={countrys} />;
  } else if (countrys.length === 1) {
    console.log(countrys);
    return <CountriesInfo countrys={countrys[0]} />;
  }
};

const Filter = ({ search, setSearch }) => {
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      debug: {search}
      <ul />
      Filter Countries:
      <input value={search} onChange={handleSearchChange} />
    </div>
  );
};

const App = () => {
  const [countrys, setCountrys] = useState([]);
  const [search, setSearch] = useState("");

  // const showSearch = persons.filter((person) =>
  //   person.name.toLowerCase().startsWith(search.toLowerCase())
  // );

  useEffect(
    () =>
      axios.get("https://restcountries.com/v3.1/all").then((response) => {
        setCountrys(response.data);
      }),
    []
  );

  const showCountrys = countrys.filter((country) =>
    country.name.common.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div>
      <Filter search={search} setSearch={setSearch} />
      <Countries countrys={showCountrys} />
    </div>
  );
};

export default App;
