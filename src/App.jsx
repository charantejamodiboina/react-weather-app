import React, { useState} from 'react';
import axios from 'axios';
import './App.css'

const API_KEY = '63d7bf505303ad81efbe70d9149726d7'; // Replace with your OpenWeatherMap API key

function App() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    // Fetch weather by user’s current location
    const getWeatherByLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                    setWeatherData(response.data);
                    setError(null);
                } catch (err) {
                    setError("Could not fetch weather data for your location.");
                }
            }, () => {
                setError("Geolocation not supported or permission denied.");
            });
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    // Fetch weather by city name
    const getWeatherByCity = async () => {
        if (!city) return;
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            setWeatherData(response.data);
            setError(null);
        } catch (err) {
            setError("Could not find weather data for the specified city.");
            setWeatherData(null);
        }
    };

    // Handle form submission for city search
    const handleSubmit = (e) => {
        e.preventDefault();
        getWeatherByCity();
    };

    return (
        <div className="App">
            <h1>Weather App</h1>

            {/* Button to get weather by location */}
            <button onClick={getWeatherByLocation}>Get Weather By Location</button>

            {/* Form to search weather by city */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button type="submit">Get Weather</button>
            </form>

            {/* Display weather data or error */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weatherData && (
                <div>
                    <h2>{weatherData.name}</h2>
                    <p>Temperature: {weatherData.main.temp} °C</p>
                    <p>Weather: {weatherData.weather[0].description}</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
            )}
        </div>
    );
}

export default App;
