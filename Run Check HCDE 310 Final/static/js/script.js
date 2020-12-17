let baseURL = "http://127.0.0.1:5000/weather/";

function getArrangementRecords() {
    let cityName = document.getElementById("search_field").value;
    let completeURL;

    if (cityName !== "") {
        completeURL = baseURL.concat(cityName);

        fetch(completeURL)
            .then(response => response.json())
            .then(recordsJSON => {
                if (recordsJSON['message'] === 'Invalid City') {
                    alert('Invalid City Name');
                    return;
                }
                const tempKelvin = recordsJSON['temp'];
                const tempCelsius = (tempKelvin - 273.16).toFixed(2);
                const tempFahrenheit = (1.8 * tempCelsius + 32).toFixed(2);

                const feelsLikeKelvin = recordsJSON['feels_like'];
                const feelsLikeCelsius = (feelsLikeKelvin - 273.16).toFixed(2);
                const feelsLikeFahrenheit = (1.8 * feelsLikeCelsius + 32).toFixed(2);

                let weatherData = "<tr class='arrangement_record'>"
                    + "<td>" + recordsJSON['name'] + "</td>"
                    + "<td>" + recordsJSON['sunrise'] + " (UTC) " + "</td>"
                    + "<td>" + recordsJSON['sunset'] + " (UTC) " + "</td>"
                    + "<td>" +
                    tempKelvin + " K / " + tempCelsius + " C / " + tempFahrenheit + " F "
                    + "</td>"
                    + "<td>" +
                    feelsLikeKelvin + " K / " + feelsLikeCelsius + " C / " + feelsLikeFahrenheit + " F "
                    + "</td>"
                    + "<td>" + (recordsJSON['precipitation'] / 100) * 100 + " %" + "</td>"
                    + "<td>" + recordsJSON['humidity'] + " %" + "</td>"
                    + "<td>" + recordsJSON['wind_speed'] + " mph" + "</td>"
                    + "<td>" + recordsJSON['weather_main'] + "</td>"
                    + "<td>" + recordsJSON['weather_desc'] + "</td>"
                    + "</tr>";
                $("table tbody").append(weatherData);
            });
    }
}
