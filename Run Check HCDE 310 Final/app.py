import requests
from flask import Flask, jsonify, abort, render_template, Response
from flask_cors import CORS, cross_origin
from api_key import api_key


app = Flask(__name__)
cors = CORS(app)


@app.route('/weather/<string:city>', methods=['GET'])
@cross_origin()
def get_weather_info(city):
    response = requests.get(f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}')

    if response.status_code == 404:
        return Response('{"message":"Invalid City"}', status=404, mimetype='application/json')

    weather_data = response.json()
    name = weather_data['name']
    temp, feels_like = weather_data['main']['temp'], weather_data['main']['feels_like']
    humidity = weather_data['main']['humidity']
    wind_speed = weather_data['wind']['speed']
    weather_main = weather_data['weather'][0]['main']
    weather_desc = weather_data['weather'][0]['description']
    sunrise_unix = weather_data['sys']['sunrise']

    lat, lon = weather_data['coord']['lat'], weather_data['coord']['lon']
    response = requests.get(f'https://api.sunrise-sunset.org/json?lat={lat}&lng={lon}')
    times_data = response.json()
    sunrise, sunset = times_data['results']['sunrise'], times_data['results']['sunset']

    response = requests.get(f'https://api.openweathermap.org/data/2.5/onecall?'
                            f'lat={lat}&lon={lon}&exclude=hourly,minutely&appid={api_key}')

    forecast_data = response.json()
    precipitation = None
    for day in forecast_data['daily']:
        if day['sunrise'] == sunrise_unix:
            precipitation = day['pop']
            break

    weather = {'name': name, 'sunrise': sunrise, 'sunset': sunset, 'temp': temp, 'feels_like': feels_like,
               'precipitation': precipitation, 'humidity': humidity, 'wind_speed': wind_speed,
               'weather_main': weather_main, 'weather_desc': weather_desc}
    return jsonify(weather)


@app.route('/')
@cross_origin()
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
