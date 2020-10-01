import React, { useState, useEffect } from 'react';
import './App.css';
import { sortData } from './util';

//components
import InfoBox from './components/InfoBoxes/InfoBox';
import Map from './components/Map/Map';
import "leaflet/dist/leaflet.css";
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';


//Material UI
import { MenuItem, FormControl, Select, Card, CardContent,} from '@material-ui/core';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData]  =  useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 39.237292, lng: 7.852885});
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/all`)
      .then((res) =>  res.json())
      .then((data) =>  {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountryData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          
          const sortedData = sortData(data)
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' 
    ? `https://disease.sh/v3/covid-19/all` 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })    
  }
  
  return (
    <div className="app">
      <div className="app__left">
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
          {console.log(countryInfo)}
          <InfoBox  title='Coronavirus Cases Today' cases={countryInfo.todayCases}  total={countryInfo.cases}  />
          <InfoBox  title='Recovered' cases={countryInfo.todayRecovered}  total={countryInfo.recovered}  />
          <InfoBox  title='Deaths' cases={countryInfo.todayDeaths}  total={countryInfo.deaths}  />
        </div>

        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
          <h3>Worldwide New Cases</h3>
            <LineGraph />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
