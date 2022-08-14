import {useState, useEffect} from 'react'
import axios from 'axios'
const api_key = process.env.REACT_APP_API_KEY


const Display = ({note}) => {
    return (
        <div> 
            <li>{note.name}</li>
        </div>
    )           
}

// When the query obtains one singular country 
const Country = ({api, country}) => {
    const [weather, setWeather] = useState([])
    // Setting a bool so components will load differently depending on if the API is loaded or not 
    const [apiBool, setApiBool] = useState(false)

    const languages = api[country.id].languages
    const currencies = api[country.id].currencies 
    
    const languageList = []
    const currencyList = []

    
    for (const [key, value] of Object.entries(languages)) {
        languageList.push({'language': value, 'id': key})
    }

    for (const [key, value] of Object.entries(currencies)){
        currencyList.push({'currency': value.name, 'symbol': value.symbol, 'id': key})
    }


    const weatherHook = () => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${api[country.id].capitalInfo.latlng[0]}&lon=${api[country.id].capitalInfo.latlng[1]}&units=imperial&appid=${api_key}`)
            .then(response => {
                    console.log("promise fulfilled")
                    setApiBool(true)
                    setWeather(response.data)
                }
            )
    }


    useEffect(weatherHook, [])
    console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${api[country.id].capitalInfo.latlng[0]}&lon=${api[country.id].capitalInfo.latlng[1]}&units=imperial&appid=${api_key}`)


    if (apiBool) {
        return (
            <div> 
                <Details api={api} country={country} languageList={languageList} currencyList={currencyList}/>
                <Weather api={api} country={country} weather={weather}/>
            </div>
        )
    } else {
        return (
            <div>
                <Details api={api} country={country} languageList={languageList} currencyList={currencyList}/>
                <h3>API Loading...</h3>
            </div>
        )
    }
}

const Details = ({api, country, languageList, currencyList}) => {
    return (
        <div>
            <h1>{country.name}</h1>
            <p>Official Name: {api[country.id].name.official}</p>
            <p>Capital: {api[country.id].capital[0]}</p>
            <p>Area: {api[country.id].area}</p>
            <p><a href={api[country.id].maps.googleMaps}>Google Maps</a></p>
            <h3>Currencies</h3>
            <ul>
                {currencyList.map(currency => <li key={currency.id}>{currency.symbol} {currency.currency}</li>)}
            </ul>
            <h3>Languages</h3>
            <ul>
                {languageList.map(language => <li key={language.id}>{language.language}</li>)}
            </ul>
            <img src={api[country.id].flags.png} alt="Png of Country Flag"></img> <img src={api[country.id].coatOfArms.png} width="200"></img>
        </div>
    )
}

const Weather = ({api, country, weather}) => {
    return (
        <div>
            <h3>Weather in {api[country.id].capital[0]}</h3>
            <p>Temperature: {weather.main.temp} Fahrenheit</p>
            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon from openweathermap.com"></img>
            <p>Conditions: {weather.weather[0].description}</p>
            <p>Wind: {weather.wind.speed} m/s</p>
        </div>
    )
}

const App = () => {
    const [notes, setNotes] = useState([]) 
    const [currentForm, setNewForm] = useState('')


    const hook = () => {
        axios 
            .get('https://restcountries.com/v3.1/all')
            .then(response => 
                setNotes(response.data)    
            )
    }


    useEffect(hook, [])

    // Getting a list of all the countries  
    const countries = notes.map(n => n.name.common)

    //onChange will update currentForm every time input value changes 
    const handleFormChange = (event) => {
        console.log(currentForm)
        setNewForm(event.target.value)
    }



    // Allows user to search for countries in real time 
    let queriedCountries = []
    for (let i = 0; i < countries.length; i++) {
        if (countries[i].toLowerCase().includes(currentForm.toLowerCase()))  {
            queriedCountries.push({'name': countries[i], 'id': i})
        }
    }

    
    let currentDisplay = queriedCountries.map(q => 
        <div>
            <Display note={q}/><button onClick={() => setNewForm(q.name)}>Show</button>
        </div>
    )

    // if the amount of countries in the list is 1 only one query is found and the Country component is shown 
    if (queriedCountries.length == 1) {
        currentDisplay = <Country api={notes} country={queriedCountries[0]}/>
    }


    return (
        <div>
            <h4>Find Countries</h4>
            <form>
                <input value={currentForm} onChange={handleFormChange}></input>
            </form>
            {currentDisplay}
        </div>
    )
}

export default App; 