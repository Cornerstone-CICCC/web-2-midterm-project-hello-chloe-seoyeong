// import {API_KEY_QUOTE} from "./config.js";

// const container = document.querySelector('.container');

// function writingQuotes(quote) {
//   const line = quote.quote;
//   const author = quote.author;

//   const randomQuote = document.querySelector('.quote');
//   randomQuote.querySelector('.line').innerText = `“${line}”`;
//   randomQuote.querySelector('.author').innerText = `- ${author}`;
// }

// const movieQuotes = async () => {
//   try {
//     const res = await fetch('https://api.api-ninjas.com/v1/quotes?category=movies', {
//       method: 'GET',
//       headers: { 'X-Api-Key': `${API_KEY_QUOTE}`},
//       contentType: 'application/json'
//     });
//     const data = await res.json();

//     writingQuotes(data[0]);
//   } catch(err) {
//     console.error(err);
//   }
// }

// movieQuotes(); // show quotes

import {API_KEY_WEATHER} from "./config.js";

const container = document.querySelector('.container');
const searchForm = document.getElementById('form');
const searchInput = searchForm.querySelector('input[type="text"');
const weather = document.querySelector('.weather');
const weatherIcon = weather.querySelector('.weather__icon');
const weatherLocation = weather.querySelector('.weather__location');
const movieItem = document.querySelectorAll('.item');
const moodBoxControl = document.querySelector('.mood-box__control');
const moodsButton = document.querySelectorAll('.moods button');
const header = document.querySelector('.header');
const headerExpandButton = header.querySelector('.header-expand');

const scrollElements = document.querySelectorAll('.scroll-hidden');
const toggleItem = document.querySelector('.toggle input[type="checkbox"]');

let weatherGenres = 99;"";
let searching = false;
let results = false;
let weatherCode = "";

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTU2NzRkMWM5ODZlMWNiNjFhOTM3MjcwYzgwMzJjNiIsIm5iZiI6MTczMjkwNzI4OC4xNTM5OTk4LCJzdWIiOiI2NzRhMTExOGU1MmYzZjNhM2M2ODYzYWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-DPOT6prYtKgg-DTvfj2rXhJ0vz8Aj3MRR6aEuIZ-Qs'
  }
};

// searching keyword
const searchKeyword = async (keyword) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=en-US&page=1`, options);
    const data = await res.json();
    if (data.results.length === 0) {
      resultsSection.classList.add('empty');
      const noResult = document.createElement('p');
      noResult.classList.add('results__empty')
      noResult.innerText = `No Results Found :(`
      resultsSection.append(noResult);
    }

    paintingLists(data.results, "search");
    // genresMovieList(28);
  } catch (err) {
    console.error(err);
  }
}

function handleSearch(e) {
  e.preventDefault();
  const searchWord = searchInput.value;
  searching = true;
  searchKeyword(searchWord);
  keyword.innerText = searchWord;
  searchInput.value = "";
}

const getWeather = async (lat, lon) => {
  try {
    // const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m&forecast_days=1`);

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metirc`);
    const data = await res.json();

    const location = data.name;
    const weather = data.weather[0].main;
    const icon = data.weather[0].icon;

    weatherLocation.innerText = location;
    weatherIcon.querySelector('span').innerText = weather;
    weatherIcon.querySelector('img').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;


    /*
      28: Action
      12: Adventure
      16: Animation
      35: Comedy
      80: Crime
      99: Documnetary
      18: Drama
      10751: Family
      14: Fantasy
      36: History
      27: Horror
      10402: Music
      9648: Mystery
      10749: Romance
      878: Science Fiction
      10770: TV Movie
      53: Thriller
      10752: War
      37: Western
     */
    if(weather === 'Clouds') {
      weatherGenres = 28;
    } else if(weather === 'Clear') {
      weatherGenres = 35;
    } else if(weather === 'Snow') {
      weatherGenres = 10751;
    } else if(weather === 'Rain') {
      weatherGenres = 80;
    } else if(weather === ('Thrunderstorm' || 'Ash' || 'Tornado')) {
      weatherGenres = 10752;
    } else if(weather === 'Fog') {
      weatherGenres = 9648;
    } else {
      weatherGenres = 14;
    }
  } catch (err) {
    console.error(err);
  } finally {
    // suggestionSection.classList.remove('hide');
    // genresMovieList(weatherGenres);
  }
}

function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeather(lat, lon);
}

function onGeoError(err) {
  genresMovieList(35);
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const changeMode = function(e) {
  if(e.target.checked) {
    container.classList.remove('dark');
    localStorage.removeItem('mode', 'dark');
  } else {
    container.classList.add('dark');
    localStorage.setItem('mode', 'dark');
  }
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
toggleItem.addEventListener('change', changeMode);

if(localStorage.getItem('mode')) {
  container.classList.add('dark');
  toggleItem.checked = false;
};