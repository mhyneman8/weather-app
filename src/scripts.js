 // if city saved in LS display
window.onload = function() {
    let city1 = localStorage.getItem("city1");
    let city2 = localStorage.getItem("city2");
    let city3 = localStorage.getItem("city3");

    if (city1 !== null) {
        document.querySelector("#city1").classList.remove("hide");
        document.querySelector("#city1").querySelector(".savedCityName").innerText = city1;
        document.querySelector('#city1Name').addEventListener("click", function () {
            weather.fetchWeather(city1);
        })
    }
    if (city2 !== null) {
        document.querySelector("#city2").classList.remove("hide");
        document.querySelector("#city2").querySelector(".savedCityName").innerText = city2;
        document.querySelector('#city2Name').addEventListener("click", function () {
            weather.fetchWeather(city2);
        })
    }
    if (city3 !== null) {
        document.querySelector("#city3").classList.remove("hide");
        document.querySelector("#city3").querySelector(".savedCityName").innerText = city3;
        document.querySelector('#city3Name').addEventListener("click", function () {
            weather.fetchWeather(city3);
        })
    }
}

let weather = {
    apiKey: config.API_KEY,
    
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q= " 
            + city 
            + "&units=imperial&appid=" 
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data))
        .catch((error) => {
            alert("Enter valid city")
            console.error("Error:", error);
        });
    },
    fetchLatWeather: function(lat, lon) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat="
            + lat
            + "&lon="
            + lon
            + "&units=imperial&appid="
            + this.apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    getLocation: () => {
        let opts = {
            enableHighAccuracy: true,
            timeout: 1000 * 10,
            maximumAge: 1000 * 60* 5,
        };
        navigator.geolocation.getCurrentPosition(weather.ftw, weather.wtf, opts);
    },
    ftw: (position) => {
        let lat = (position.coords.latitude);
        let lon = (position.coords.longitude);
    
        weather.fetchLatWeather(lat, lon);
    },
    wtf: (err) => {
        alert("Oops, couldn't find you.");
        console.error(err);
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, temp_min, temp_max, feels_like } = data.main;
        const { speed } = data.wind;
        const { sunset, sunrise } = data.sys;
        const ss = new Date(sunset * 1000);
        const ssHrs = ss.getHours() > 12 ? ss.getHours() -12 : ss.getHours();
        const ssMins = (ss.getMinutes() < 10 ? "0" : "") + ss.getMinutes();
        const sr = new Date(sunrise * 1000);
        const srHrs = sr.getHours() > 12 ? sr.getHours()-12 : sr.getHours() ;
        const srMins = (sr.getMinutes() < 10 ? "0" : "") + sr.getMinutes();
        const ssAmPm = (ss.getHours() > 12 ? " PM" : " AM");
        const srAmPm = (sr.getHours() > 12 ? " PM" : " AM");

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
        document.querySelector(".sunrise").innerText = "Sunrise starts at: " + srHrs + ":" + srMins + srAmPm;
        document.querySelector(".sunset").innerText = "Sunset starts at: " + ssHrs +":" + ssMins + ssAmPm;

        if(name.toLowerCase() !== localStorage.getItem("defaultCity")) {
            document.querySelector(".save").classList.remove("hide");
        }

        // find users location
        document.querySelector(".btnCurrent").addEventListener("click", weather.getLocation);

        // modal show
        document.querySelector(".details").addEventListener("click", function() {
            document.querySelector(".modal").classList.add("show");
            // changes emoji based on feels_like temp
            weather.emoji(feels_like);
        }),
        // modal close
        document.querySelector(".modal .close").addEventListener("click", function() {
            document.querySelector(".modal").classList.remove("show");
        });
        // save city on save click
        document.querySelector(".save").addEventListener("click", function() {
            weather.favoriteWeather(name)
        })
    },

    favoriteWeather: function(name) {
        let defaultCity = localStorage.getItem("defaultCity");
       
        if(name.toLowerCase() == defaultCity) {
            
        } else if (name.toLowerCase() !== defaultCity) {
            
        // call favorites on save click
        let city1 = localStorage.getItem("city1");
        let city2 = localStorage.getItem("city2");
        let city3 = localStorage.getItem("city3");
    
        if(city1 == null) {
            // save favorites
            document.querySelector("#city1").querySelector(".savedCityName").innerText = name;
            document.querySelector("#city1").classList.remove("hide");
            localStorage.setItem("city1", name);
        } else if(city1 !== null && city2 == null) {
            if(name == city1){
                
            } else {
                document.querySelector("#city2").querySelector(".savedCityName").innerText = name;
                document.querySelector("#city2").classList.remove("hide");
                localStorage.setItem("city2", name); 
            }
            
        } else if(city2 !== null && city3 == null) {
            if(name == city2 || name == city1){
                
            } else {
                document.querySelector("#city3").querySelector(".savedCityName").innerText = name;
                document.querySelector("#city3").classList.remove("hide");
                localStorage.setItem("city3", name);
            }
        } else {
            alert("Remove a saved city first");
        };
    }
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
        document.querySelector(".search-bar").value = null;
    },
    emoji: function(temp) {
        const face = document.querySelector(".face");

        if (temp > 100) {
            face.src = "./img/101+.jpg";
        } else if ( temp >= 85) {
            face.src = "./img/91-100.png";
        }
        else if (temp > 55) {
            face.src = "./img/70-85.png";
        } else if ( temp > 31) {
            face.src = "./img/20-32.jpg";
        } else if (temp < 32) {
            console.log("fix this");
        } else if (temp < 20) {
            face.src = "./img/20-.jpg";
        } 
        else {
            console.log("none temp " + temp)
        }
    },
};

// search weather on button click
document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

// search weather on enter hit
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

// settings
document.querySelector(".settings").addEventListener("click", function() {
    if (document.querySelector(".menu").style.visibility === "visible") {
        document.querySelector(".menu").style.visibility = "hidden"
    } else {
        document.querySelector(".menu").style.visibility = "visible"
    }
})

// menu visibility
document.querySelector(".menu").addEventListener("mouseover", function() {
    document.querySelector(".menu").style.visibility = "visible";
})
document.querySelector(".menu").addEventListener("mouseout", function() {
    document.querySelector(".menu").style.visibility = "hidden";
})

// change default city button
document.querySelector(".changeCity").addEventListener("click", function() {
    document.querySelector(".newCity").classList.remove("hide");
})

// new default city input
document.querySelector(".newCity").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        let newCity = document.querySelector(".newCity").value;

        if(newCity == null || newCity == 0) {
            alert("Must enter a city");
        } else {
            document.querySelector(".menu").style.visibility = "hidden";
            document.querySelector(".newCity").classList.add("hide");
            
            localStorage.setItem("defaultCity", newCity);
            weather.fetchWeather(newCity);
        }
    }
});

// click saved cities to search that city
document.querySelector("#city1").querySelector(".savedCityName").addEventListener("click", function () {
    let city = localStorage.getItem("city1");
    weather.fetchWeather(city);
});
document.querySelector("#city2").querySelector(".savedCityName").addEventListener("click", function () {
    let city = localStorage.getItem("city2");
    weather.fetchWeather(city);
});
document.querySelector("#city3").querySelector(".savedCityName").addEventListener("click", function () {
    let city = localStorage.getItem("city3");
    weather.fetchWeather(city);
});

// delete favorite cities
document.querySelector("#city1 .close").addEventListener("click", function () {
    document.querySelector("#city1").classList.add("hide");
    localStorage.removeItem("city1");
})
document.querySelector("#city2 .close").addEventListener("click", function () {
    document.querySelector("#city2").classList.add("hide");
    localStorage.removeItem("city2");
})
document.querySelector("#city3 .close").addEventListener("click", function () {
    document.querySelector("#city3").classList.add("hide");
    localStorage.removeItem("city3");
})