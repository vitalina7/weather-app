const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const currentWeather = document.querySelector('.current-weather-items');
const timezone = document.querySelector('.time-zone');
const country = document.querySelector('.country');
const weatherForecast = document.querySelector('.weather-forecast');
const currentTempEl = document.querySelector('.today');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Avg', 'Sep', 'Oct', 'Nov', 'Dec'];
const apiKey = '49cc8c821cd2aff9af04c9f98c36eb74';
setInterval(()=> {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat= hour >= 13 ? hour %12 : hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    timeEl.innerHTML = hoursIn12HrFormat + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML=days[day] + ',' + date + ' '+ months[month]
}, 1000)
getWeatherData();


function getWeatherData() {
     navigator.geolocation.getCurrentPosition((success) => {

         let {latitude, longitude } = success.coords;

         fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${apiKey}`).then(res => res.json()).then(data => {

         console.log(data)
         showWeatherData(data);
         })

     })
}

function showWeatherData(data) {
    const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    timezone.innerHTML = data.timezone;
    country.innerHTML = data.lat + 'N ' + data.lon + 'E';
    weatherForecast.innerHTML=`<div class="weather-item">
         <div>Humidity</div>
         <div>${humidity}%</div>
     </div>
     <div class="weather-item">
         <div>Pressure</div>
         <div>${pressure}</div>
     </div>
     <div class="weather-item">
         <div>Wind Speed</div>
         <div>${wind_speed}</div>
     </div>

     <div class="weather-item">
         <div>Sunrise</div>
         <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
     </div>
     <div class="weather-item">
         <div>Sunset</div>
         <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
     </div>`;

 let otherDayForcast = ''
     data.daily.forEach((day, idx) => {
         if(idx == 0){
             currentTempEl.innerHTML = `
             <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
             <div class="other">
                 <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                 <div class="temp">Night - ${day.temp.night}&#176;C</div>
                 <div class="temp">Day - ${day.temp.day}&#176;C</div>
             </div>
             
             `
         }else{
             otherDayForcast += `
             <div class="weather-forecast-item">
                 <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                 <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                 <div class="temp">Night - ${day.temp.night}&#176;C</div>
                 <div class="temp">Day - ${day.temp.day}&#176;C</div>
             </div>
             
             `
         }
     })


     weatherForecastEl.innerHTML = otherDayForcast;

}