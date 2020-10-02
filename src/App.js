import React, { useState, useEffect } from 'react';
import './App.css';
import { sortData, prettyPrintStat } from './util';

//components
import InfoBox from './components/InfoBoxes/InfoBox';
import Map from './components/Map/Map';
import "leaflet/dist/leaflet.css";
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';


//Material UI
import { MenuItem, FormControl, Select, Card, CardContent,} from '@material-ui/core';

function App() {

  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

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
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' 
    ? `https://disease.sh/v3/covid-19/all` 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })    
  }
  
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select
              className="app__select"
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
          <InfoBox 
            isRed
            onClick={e => setCasesType('cases')} 
            title='Coronavirus Cases Today' 
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}  
            active={casesType === "cases"}
          />
          <InfoBox 
            onClick={(e) => setCasesType('recovered')} 
            title='Recovered Today' 
            cases={prettyPrintStat(countryInfo.todayRecovered)}  
            total={countryInfo.recovered}  
            active={casesType === "recovered"}
          />
          <InfoBox 
            isRed
            onClick={e => setCasesType('deaths')} 
            title='Deaths Today' 
            cases={prettyPrintStat(countryInfo.todayDeaths)}  
            total={countryInfo.deaths}  
            active={casesType === "deaths"}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
