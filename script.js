function getWeather() {
    const apiKey = '5bbdec7361c2c3b434d50c907f14791e';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Veuillez entrer une ville');
        return;
    }

   // URL de l'API pour la météo actuelle et les prévisions horaires, en français et en unités métriques
   const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=fr&units=metric`;
   const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=fr&units=metric`;

    // Récupération des données météo actuelles
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données météo actuelles :', error);
            alert('Erreur lors de la récupération des données météo actuelles. Veuillez réessayer.');
        });

    // Récupération des prévisions horaires
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des prévisions horaires :', error);
            alert('Erreur lors de la récupération des prévisions horaires. Veuillez réessayer.');
        });
}

// Fonction pour afficher la météo actuelle
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Vider le contenu précédent
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp); // Déjà en Celsius, pas besoin de conversion
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

// Fonction pour afficher les prévisions horaires
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); // Afficher les 24 prochaines heures (intervalles de 3 heures)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convertir l'horodatage en millisecondes
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp); // Déjà en Celsius, pas besoin de conversion
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Icône météo horaire">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Fonction pour afficher l'icône météo
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Afficher l'image une fois qu'elle est chargée
}
