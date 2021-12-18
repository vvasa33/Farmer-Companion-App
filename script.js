const getWeather = async (lat, long) => {
  const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f7db8487cfbe4974a95154945211812&q=${lat},${long}&days=10&aqi=no&alerts=yes`);
  const data = await response.json();
  return data;
}


navigator.geolocation.getCurrentPosition(async (pos) => {
  const { latitude, longitude } = pos.coords;
  const weather = await getWeather(latitude,longitude);
  
  document.getElementById("location").innerText = weather.location.name;
  document.getElementById("region").innerText = `${weather.location.region}, ${weather.location.country}`;
  document.getElementById("temperature").innerText = weather.current.feelslike_f + "°F";
  let alertText = "";
  const alerts = weather.alerts.alert;
  for (const alert in alerts) {
    alertText += `\n${parseInt(alert)+1}. \n${alerts[alert].desc}\n`
  }
  
  document.getElementById("alerts").innerText = alertText;

  // weather.forecast.forecastday
  let accumulator = 0;
  let counter = 0;
  const forecast = weather.forecast.forecastday
  for (const x in forecast) {
    const { date } = forecast[x]
    const { avgtemp_f, condition, daily_chance_of_rain }= forecast[x].day
    const img = document.createElement("img");
    img.src = condition.icon;
    img.setAttribute("style", "display:block;margin-left:auto;margin-right: auto;");
    const div = document.getElementById(`day${parseInt(x)+1}`)
    // div.appendChild(img);
    accumulator += daily_chance_of_rain;
  
    div.innerText = `Date: - ${date}\nTemperature: ${avgtemp_f}\nCondition: ${condition.text}`
    div.appendChild(img)
    counter += 1
  }
  let meanValue = accumulator/counter;
  if (meanValue <= 25) {
    document.getElementById("info").innerText = "There is not that big of a chance for rain. The weather isn't too great for crops.";
  } else if (meanValue >= 26 && meanValue <= 50) {
    document.getElementById("info").innerText = "The chance of rain is somewhat low, but close to 50%. It would be risky to plant crops now."
  } else if (meanValue >= 50 && meanValue <= 69) {
    document.getElementById("info").innerText = "The chance of rain is somewhat high, but still close to 50%. It's still good to plant crops though."
  } else if (meanValue >=70 && meanValue <=100) {
    document.getElementById("info").innerText = "The chance of rain is very high. It's a great time to plant crops!"
  }
  
  document.getElementById("accumulater").innerText = Math.floor(meanValue) + "% Chance of Rain in the next 2 days combined";
  
  
}, (error) => {
  console.warn(`ERROR(${error.code}): ${error.message}`);
}, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
})

