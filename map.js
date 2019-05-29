var lat;
var lon;
var city;
var searches = [];
///Map leaflet
var mymap = L.map("mapid").setView([-37.686732, 176.167361], 12);
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken:
      "pk.eyJ1IjoibmlremthbWJsZSIsImEiOiJjanZwM2RqZnYxandoNGFtdXBudDVxaG14In0.eLpdiGMW-Tgjlm7ESiQyrA"
  }
).addTo(mymap);

//Fetch for GeoCode
getGeo = function(city) {
  let t = document.getElementById("title").value;
  if(t !=""){
  if (city !== undefined && city != "") {
    t = city;
  }

  fetch(
    "https://www.mapquestapi.com/geocoding/v1/address?key=rc4puJCVccyEU6nof9O4rFRiJvkmvWc5" +
      "&location=" +
      t+ "%2CNZ"
  )
    .then(response => response.json())
    .then(json => showInfo(json));
  }else{
    alert("Please Enter a city")
  }
};

showInfo = function(info) {
  // console.log(JSON.stringify(info(results[0].locations[0].latLng)));
  // display =
  //   "lat is " +
  //   info.results[0].locations[0].latLng.lat +
  //   " long is " +
  //   info.results[0].locations[0].latLng.lng;
  // document.getElementById("info").innerHTML = display;
  if (info.results[0].locations[0].adminArea1 == "NZ" && info.results[0].locations[0].geocodeQuality == "CITY" ) {
    lat = info.results[0].locations[0].latLng.lat;
    lon = info.results[0].locations[0].latLng.lng;
    city = info.results[0].providedLocation.location;
  } else {
    alert("please enter a city in NZ");
  }
  mymap.setView({ lat, lon }, 12);
  console.log(lat)
  //store data in array
  if ( searches.length == 0 || (searches.filter(function (search) { return search.city == city }).length == 0)) {
    searches.push({
      "city": city,
      "lat": lat,
      "lon": lon
    });
  }

  getSun();
};

getSun = function() {
  // fetch("https://api.sunrise-sunset.org/json?lat=-37.686732&lng=176.167361")
  fetch("sunrise.php?lat=" + lat + "&lng=" + lon)
    .then(response => response.json())
    .then(json => sunRise(json))
    .then(getWeatherInfo());

  updateSearches();
};

sunRise = function(data) {
   //console.log(JSON.stringify(info(results[0].locations[0].latLng)));
  // console.log(data.results.sunrise);
  console.log(data.results.sunset);
  display =
    city +
    " currently: Sun Rise at " +
    data.results.sunrise +
    " and Sets at " +
    data.results.sunset;
  document.getElementById("info1").innerHTML = display;
};

var request;
getWeatherInfo = function() {
  // https://api.openweathermap.org/data/2.5/weather?lat=-37.686732&lon=176.167361&mode=xml&APPID=348ecf1b294d7f120bf3d74104f7c926
  // let t = document.getElementById("title").value;
  request = new XMLHttpRequest();
  url = "weather.php?lat=" + lat + "&lon=" + lon;
  request.open("GET", url);
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status == 200) {
        result = request.responseText;
        displayInfo(result);
      }
    }
  };
  request.send();
};

displayInfo = function(info) {
  let parser = new DOMParser();
  xmlDoc = parser.parseFromString(info, "text/xml");

  main = xmlDoc.getElementsByTagName("current")[0];
  weather = main.getElementsByTagName("weather")[0];
  temperature = main.getElementsByTagName("temperature")[0];
  tempmin = temperature.getAttribute("min") - 273;
  tempmax = temperature.getAttribute("max") - 273;

  display = "Current weather is " + weather.getAttribute("value");
  display += " and max temp: " + tempmax.toFixed(2) + "°C";
  display += " min temp: " + tempmin.toFixed(2) + "°C";
  document.getElementById("info2").innerHTML = display;
};

function updateSearches() {
  document.getElementById("searches").innerHTML = "";
  
  var textnode = document.createTextNode("Recent Searches:")
  document.getElementById("searches").appendChild(textnode);
  for (var i = 0; i < searches.length; i++) {
    var city = searches[i].city;
    // var lat = searches[i].lat;
    // var lon = searches[i].lon;
    var search = document.createElement("a"); // Create a <button> element
    search.innerHTML = city.replace(",NZ",""); // Insert text4
    search.setAttribute("href", "#");
    search.setAttribute("onclick", "getGeo('" + city.replace(",NZ","") + "')");
    //search.onclick = getGeo(lat, lon);
    document.getElementById("searches").appendChild(search);    

  }
}
