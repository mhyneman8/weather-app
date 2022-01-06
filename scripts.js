let weather = {
    apiKey: config.apiKey,
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q= " 
            + city 
            + "&units=imperial&appid=" 
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    getLocation: (ev) => {
        let opts = {
            enableHighAccuracy: true,
            timeout: 1000 * 10,
            maximumAge: 1000 * 60* 5,
        };
        navigator.geolocation.getCurrentPosition(weather.ftw, weather.wtf, opts);
    },
    ftw: (position) => {
        // navigator.geolocation.getCurrentPosition(locationSuccess);
        // function locationSuccess(position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            console.log(this.apiKey)
            fetch (
              "https://api.openweathermap.org/data/2.5/weather?lat="
            + latitude
            + "&lon="
            + longitude
            + "&appid="
            + this.apiKey   
            ).then((response) => response.json())
            .then((data) => this.displayWeather(data))
            console.log(latitude);
            console.log(longitude);
    },

    //     //get position
    //     do
    
    // wtf: (err) => {
      
    //     alert("Oops, could not find you.");
    //     // console.error(err);
    // },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, temp_min, temp_max, feels_like } = data.main;
        const { speed } = data.wind;
        const { sunset, sunrise } = data.sys;
        const ss = new Date(sunset * 1000);
        const ssHrs = ss.getHours() - 12;
        const ssMins = ss.getMinutes();
        const sr = new Date(sunrise * 1000);
        const srHrs = sr.getHours() - 12;
        const srMins = sr.getMinutes();

        // call weather data to display
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = 
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "mph";
        // show loading
        document.querySelector(".weather").classList.remove("loading");
        // background images match city searched
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";

        // call more data in modal
        document.querySelector(".modal-title").innerText = name;
        document.querySelector(".feels").innerText = "Feels like: " + Math.round(feels_like) + "°F";
        document.querySelector(".high").innerText = "The high today is: " + Math.round(temp_max) + "°F";
        document.querySelector(".low").innerText = "The low today is: " + Math.round(temp_min) + "°F";
        document.querySelector(".sunrise").innertext = "Sunrise starts at: " + srHrs + ":" + srMins + " PM";
        document.querySelector(".sunset").innerText = "Sunset starts at: " + ssHrs +":" + ssMins + " AM";

        // find users location
        document.getElementById("btnCurrent").addEventListener("click", weather.getLocation);
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

// default city
if(localStorage.getItem("defaultCity") == null) {
    weather.fetchWeather("Chicago");
} else {
    weather.fetchWeather(localStorage.getItem("defaultCity"));
}



// modal show
document.querySelector(".details").addEventListener("click", function() {
    document.querySelector(".modal").classList.add("show");
})

// modal close
document.querySelector(".close").addEventListener("click", function() {
    document.querySelector(".modal").classList.remove("show");
})

// settings
document.querySelector(".settings").addEventListener("click", function() {
    var menu = document.querySelector(".menu");
    if(menu.style.visibility === "visible") {
        menu.style.visibility = "hidden"
    } else {
        menu.style.visibility = "visible"
    }
})

// change city button
document.querySelector(".changeCity").addEventListener("click", function() {
    document.querySelector(".newCity").classList.remove("hide");
})

// new city input
document.querySelector(".newCity").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        let newCity = document.querySelector(".newCity").value;
        localStorage.setItem("defaultCity", newCity)
        weather.fetchWeather(newCity);
    }
});
