const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const searchInput = document.querySelector('.search-box input');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

// Function to handle the search operation
function searchWeather() {
    const APIKey = 'f7e7c4511413a8a65a994a1e3d532200';
    const city = searchInput.value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Mist':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)} km / h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        });
}

// Function to get the weather for the user's current location
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`)
                .then(response => response.json())
                .then(json => {
                    if (json.cod === '404') {
                        container.style.height = '400px';
                        weatherBox.style.display = 'none';
                        weatherDetails.style.display = 'none';
                        error404.style.display = 'block';
                        error404.classList.add('fadeIn');
                        return;
                    }

                    error404.style.display = 'none';
                    error404.classList.remove('fadeIn');

                    // Update the input field with the user's location
                    searchInput.value = json.name;

                    const image = document.querySelector('.weather-box img');
                    const temperature = document.querySelector('.weather-box .temperature');
                    const description = document.querySelector('.weather-box .description');
                    const humidity = document.querySelector('.weather-details .humidity span');
                    const wind = document.querySelector('.weather-details .wind span');

                    switch (json.weather[0].main) {
                        case 'Clear':
                            image.src = 'images/clear.png';
                            break;
                        case 'Rain':
                            image.src = 'images/rain.png';
                            break;
                        case 'Snow':
                            image.src = 'images/snow.png';
                            break;
                        case 'Clouds':
                            image.src = 'images/cloud.png';
                            break;
                        case 'Mist':
                            image.src = 'images/mist.png';
                            break;
                        default:
                            image.src = '';
                    }

                    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                    description.innerHTML = `${json.weather[0].description}`;
                    humidity.innerHTML = `${json.main.humidity}%`;
                    wind.innerHTML = `${parseInt(json.wind.speed)} km / h`;

                    weatherBox.style.display = '';
                    weatherDetails.style.display = '';
                    weatherBox.classList.add('fadeIn');
                    weatherDetails.classList.add('fadeIn');
                    container.style.height = '590px';
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}


// Add an event listener to the "Current Location" button
const currentLocationButton = document.getElementById('current-location-button');
currentLocationButton.addEventListener('click', getCurrentLocationWeather);

search.addEventListener('click', searchWeather);

// Add event listener for Enter key press
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchWeather();
    }
});
