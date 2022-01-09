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
        console.log("display: " + name);
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
       
       
        // call favorites on save click
        document.querySelector(".save").addEventListener("click", function() {
            // save favorites
            document.querySelector("#saved-city").innerText = name + ": " + Math.round(temp) + "°F";
            document.querySelector(".saved").classList.remove("hide");
            // let cityArr = [];
            // let fav1 = localStorage.getItem("firstCity");
            // let fav2 = localStorage.getItem("secCity");
            // let fav3 = localStorage.getItem("thirdCity");
            // let defaultCity = localStorage.getItem("defaultCity")
            // cityArr.push([name]);
            // console.log("array" + cityArr)
            // console.log( "fav " + name);
            
            // if (fav1 == null) {
            //     // save 
            //     localStorage.setItem("firstCity", name);
            //     document.querySelector("#saved-city").innerText = name + ": " + temp + "°F";
            //     console.log("first city")
            // } else {
            //     console.log("not null: " + name);
            // }
            // else if (fav2 == null) {
            //     //save
            //     localStorage.setItem("secCity", data.name);
            //     console.log("first city")
            // } else if (fav3 == null) {
            //     //save
            //     localStorage.setItem("thirdCity", data.name)
            //     console.log("first city")
            // } 
            // else {
            //     alert("Saved city list is full. Delete one before saving another.")
            // }
    
            // let savedCities = [];
            // // let newFav = [data.name, data.main.temp]
            // console.log(data.name);
            
            // console.log(old)
            // savedCities.unshift([old]);
            // savedCities.push([data.name, Math.round(data.main.temp)]);
            // console.log(savedCities);
    
            
            
            // savedCities.push("Test");
            // localStorage.setItem("saved_citis", savedCities);   
        });
        // delete favorite 
        document.querySelector(".saved .close").addEventListener("click", function () {
            document.querySelector(".saved").classList.add("hide");
        })

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
        
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
        document.querySelector(".search-bar").value = null;
        // weather.favorites(name, temp)
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


