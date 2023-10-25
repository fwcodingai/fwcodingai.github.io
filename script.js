const apiKey = '8630fb95500e3ec17c899db66db71cd1';
const zoekInvoer = document.getElementById('search');
const weerInfo = document.getElementById('weatherInfo');
const updateTeller = document.getElementById('updateCounter');

let secondenResterend = 60;

function krijgGebruikerstaal() {
    return navigator.language || 'nl-NL';
}

zoekInvoer.addEventListener('keyup', (gebeurtenis) => {
    if (gebeurtenis.key === 'Enter') {
        zoekWeer();
        // Disable the Enter key after a city search
        zoekInvoer.disabled = true;
    }
});

function zoekWeer() {
    const stad = zoekInvoer.value;
    const gebruikerstaal = krijgGebruikerstaal();

    haalWeerOp(stad, gebruikerstaal);

    startTellerInterval();
}

function haalWeerOp(stad, gebruikerstaal) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${stad}&appid=${apiKey}&lang=${gebruikerstaal}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netwerkfout of ongeldige stadsnaam');
            }
            return response.json();
        })
        .then(data => {
            const beschrijving = data.weather[0].description;
            const temperatuur = (data.main.temp - 273.15); 
            const gevoelsTemperatuur = (data.main.feels_like - 273.15);
            const windsnelheid = data.wind.speed;
            const windBeschrijving = krijgWindBeschrijving(windsnelheid, gebruikerstaal);

            weerInfo.innerHTML = `Het weer in ${stad}: ${beschrijving}. Temperatuur: ${temperatuur.toFixed(0)}°C. Gevoelstemperatuur: ${gevoelsTemperatuur.toFixed(0)}°C. Windsnelheid: ${windsnelheid} m/s (${windBeschrijving})`;
        })
        .catch(error => {
            console.error(error);
            weerInfo.innerHTML = 'We konden geen weerinformatie voor die stad vinden.';
        });
}

function krijgWindBeschrijving(windsnelheid, gebruikerstaal) {
    let windBeschrijving = "";
    if (windsnelheid < 1) {
        windBeschrijving = "Rustig";
    } else if (windsnelheid < 5) {
        windBeschrijving = "Lichte bries";
    } else if (windsnelheid < 10) {
        windBeschrijving = "Matige bries";
    } else {
        windBeschrijving = "Sterke bries";
    }

    return windBeschrijving;
}

function updateTellerEnWeer() {
    if (secondenResterend === 0) {
        const stad = zoekInvoer.value;
        const gebruikerstaal = krijgGebruikerstaal();
        haalWeerOp(stad, gebruikerstaal);
        secondenResterend = 60;
    }
    updateTeller.innerText = `Volgende update over: ${Math.floor(secondenResterend / 60)} minuten en ${secondenResterend % 60} seconden`;
    secondenResterend--;
}

function startTellerInterval() {
    updateTellerEnWeer();
    const intervalId = setInterval(updateTellerEnWeer, 1000);
    
    // Clear the interval when secondenResterend reaches 0
    if (secondenResterend === 0) {
        clearInterval(intervalId);
        zoekInvoer.disabled = false; // Re-enable the input
    }
}
