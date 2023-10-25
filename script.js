const apiKey = '8630fb95500e3ec17c899db66db71cd1';
const searchInput = document.getElementById('search');
const weatherInfo = document.getElementById('weatherInfo');
const updateCounter = document.getElementById('updateCounter');

let secondsRemaining = 60; // Time in seconds before the next update, changed to 60 seconds
let userLanguage = getUserLanguage();

function getUserLanguage() {
    return navigator.language || 'en-US';
}

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        zoekWeer();
    }
});

function zoekWeer() {
    const stad = searchInput.value;

    fetchWeather(stad);

    startCounterInterval();
}

function fetchWeather(stad) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${stad}&appid=${apiKey}&lang=${userLanguage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error or invalid city name');
            }
            return response.json();
        })
        .then(data => {
            const beschrijving = data.weather[0].description;
            const temperatuur = (data.main.temp - 273.15); 
            const gevoelsTemperatuur = (data.main.feels_like - 273.15);
            const windsnelheid = data.wind.speed;
            const windBeschrijving = getWindDescription(windsnelheid);

            weatherInfo.innerHTML = `Het weer in ${stad}: ${beschrijving}. Temperatuur: ${temperatuur.toFixed(0)}°C. Gevoelstemperatuur: ${gevoelsTemperatuur.toFixed(0)}°C. Windsnelheid: ${windsnelheid} m/s (${windBeschrijving})`;
        })
        .catch(error => {
            console.error(error);
            weatherInfo.innerHTML = 'We konden geen weersinformatie vinden voor die stad.';
        });
}

function getWindDescription(windsnelheid) {
    let windBeschrijving = "";
    if (windsnelheid < 1) {
        windBeschrijving = "Kalm";
    } else if (windsnelheid < 5) {
        windBeschrijving = "Lichte bries"; // Changed to "Lichte bries" in Dutch
    } else if (windsnelheid < 10) {
        windBeschrijving = "Matige bries";
    } else {
        windBeschrijving = "Sterke bries";
    }

    return windBeschrijving;
}

function updateCounterAndWeather() {
    if (secondsRemaining === 0) {
        const stad = searchInput.value;
        fetchWeather(stad);
        secondsRemaining = 60;
    }

    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    let counterText;
    if (userLanguage === 'nl') {
        counterText = `Volgende update over: ${minutes} minuten en ${seconds} seconden`;
    } else {
        counterText = `Next update in: ${minutes} minutes and ${seconds} seconds`;
    }

    updateCounter.innerText = counterText;
    secondsRemaining--;
}

function startCounterInterval() {
    updateCounterAndWeather();
    setInterval(updateCounterAndWeather, 1000);
}