import React, { useState, useEffect } from 'react';
import './App.css';

//components
import InfoBox from './components/InfoBoxes/InfoBox';
import Map from './components/Map/Map';

//Material UI
import { MenuItem, FormControl, Select, } from '@material-ui/core';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')

  useEffect(() => {
    const getCountryData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          setCountries(countries)
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

  }
  
  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className='app__dropdown'>
          <Select
            varient='outlined'
            value={country}
            onChange={onCountryChange} 
          >
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox  title='Coronavirus Cases' cases={57}  total={2000}  />
        <InfoBox  title='Recovered' cases={12}  total={3000}  />
        <InfoBox  title='Deaths' cases={30}  total={4000}  />
      </div>


    {/* table */}
    {/* graphs */}

    {/* Map */}
    <Map/>

    </div>
  );
}

export default App;
