// import "./env.js";
import {API_KEY_WEATHER} from "./config.js";

const container = document.querySelector('.container');
const suggestionSection = document.querySelector('.suggestion');
const suggestionList = suggestionSection.querySelector('.charts');
const movieSection = document.querySelector('.movie');
const movieList = movieSection.querySelector('.charts');
const moiveTitle = movieSection.querySelector('.section__title');
const tvSection = document.querySelector('.tv');
const tvList = tvSection.querySelector('.charts');
const tvTitle = tvSection.querySelector('.section__title');
const resultsSection = document.querySelector('.results');
const resultsList = resultsSection.querySelector('.charts');
const keyword = resultsSection.querySelector('.results__keyword');
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

let weatherGenres = 99;"";
let searching = false;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTU2NzRkMWM5ODZlMWNiNjFhOTM3MjcwYzgwMzJjNiIsIm5iZiI6MTczMjkwNzI4OC4xNTM5OTk4LCJzdWIiOiI2NzRhMTExOGU1MmYzZjNhM2M2ODYzYWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-DPOT6prYtKgg-DTvfj2rXhJ0vz8Aj3MRR6aEuIZ-Qs'
  }
};

const createModal = function (element) {
  const {
    title = element.title ? element.title : element.name,
    overview,
    backdrop_path,
    vote_average,
    homepage,
    genres: [
      ...rest
    ]
  } = element; // function name() {} 이렇게 했을 때는 안됐는데, 말이지

  console.log(title, overview, vote_average, homepage, rest);
  // console.log(element.title, element.overview, element.vote_average, element.homepage, element.genres[0].id, element.genres[0].name);

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  // const modal = document.createElement('div');
  // modal.classList.add('modal');

  let genres = document.createElement('ul');
  genres.classList.add('sumup-info__genres')
  rest.forEach(item => {
    const genresItem = document.createElement('li');
    genresItem.innerText = item.name;
    genres.append(genresItem);
  })

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__img">
        <img src="https://image.tmdb.org/t/p/w500/${backdrop_path}" />
      </div>
      <div class="modal__contents">
        <h4 class="contents__title">${title}</h4>
        <div class="contents__sumup">
          <div class="contents__sumup-info">
            <a href="${homepage}" class="sumup-info__link" target="_blank">${homepage}</a>
            <span class="sumup-info__vote">${vote_average.toFixed(2)}</span>
          </div>
        </div>
        <p class="contents__overview">${overview}</p>
      </div>
      <button class="modal__btn-close">
        <i class="fa-solid fa-xmark"></i>
        <span class="a11y-hidden">Close Modal</span>
      </button>
    </div>
  `;

  container.append(overlay);
  // overlay.append(modal);

  const movieInfo = document.querySelector('.contents__sumup-info');
  movieInfo.append(genres);

  const btnCloseModal = document.querySelector('.modal__btn-close');
  btnCloseModal.addEventListener('click', function () {
    overlay.remove();
  })
}

const handleModal = async (element) => {
  const videoId = element.currentTarget.dataset.id;
  const videoSection = element.currentTarget.parentElement.parentElement.parentElement;
  const videoType = videoSection.classList.contains('tv');
  let res, data;
  try {
    if(videoType === true) {
      res = await fetch(`https://api.themoviedb.org/3/tv/${videoId}?language=en-US`, options);
      data = await res.json();
    } else {
      res = await fetch(`https://api.themoviedb.org/3/movie/${videoId}?language=en-US`, options);
      data = await res.json();
    }
    createModal(data);
  } catch(err) {
    console.error(err);
  }
}

function createItem(item, section) {
  // if(!item.poster_path) {
  //   item.poster_path = `https://placehold.co/200x300`;
  // }
  // let itemObject = {
  //   title: "",
  //   posterPath: item.poster_path,
  //   mediaType: item.media_type ? item.media_type : "media",
  //   id: item.id
  // };

  // if(itemObject.mediaType === "movie") {
  //   itemObject.title = item.title;
  // } else if(itemObject.mediaType === "tv") {
  //   itemObject.title = item.name;
  // } else {
  //   itemObject.title = item.original_title;
  // }

  // const {title, posterPath, mediaType, id} = itemObject;

  const {
    title = item.original_title ? item.original_title : item.name,
    poster_path,
    media_type = item.media_type ? item.media_type : "media",
    id,
    vote_average
  } = item;

  const itemDiv = document.createElement('div');
  let imageUrl = `https://image.tmdb.org/t/p/w200${poster_path}`;

  if(imageUrl === "https://image.tmdb.org/t/p/w200null") {
    imageUrl = `https://placehold.co/200x300`;
  }

  if(media_type === "tv" || media_type === "movie" || media_type === "media") {
    itemDiv.classList.add('item');
    itemDiv.setAttribute('data-id', id);
    itemDiv.innerHTML = `
      <div class="item__image">
        <img src="${imageUrl}" alt="${media_type} image">
      </div>
      <div class="item__info">
        <h3 class="item__title">${title.toUpperCase()}</h3>
        <span class="item__score">${vote_average.toFixed(2)}</span>
      <div>
      `;
  } else if(media_type === 'person') {
    return false;
  }

  if(section === 'movie') {
    movieList.append(itemDiv);
  } else if(section === 'suggestion') {
    suggestionList.append(itemDiv);
  } else if(section === 'search') {
    resultsList.append(itemDiv);
  } else if(section === 'tv') {
    tvList.append(itemDiv);
  }

}

// getting trending moive
const trendingMovie = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US?page=1', options);
    // const res = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=1&sort_by=popularity.desc&vote_average.gte=7&with_origin_country=KR&without_genres=18%7C10749`, options) // search by country & language
    const data = await res.json();
    console.log(data)
    paintingLists(data.results, "movie");
  } catch (err) {
    console.error(err);
  }
}

// getting trending tv
const trendingTv = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options);
    const data = await res.json();
    paintingLists(data.results, "tv");
  } catch (err) {
    console.error(err);
  }
}

// searching keyword
const searchKeyword = async (keyword) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=en-US&page=1`, options);
    const data = await res.json();
    if (data.results.length === 0) {
      resultsSection.classList.add('empty');
      const noResult = document.createElement('p');
      noResult.innerText = `No Results Found :(`
      resultsSection.append(noResult);
    }

    paintingLists(data.results, "search");
    // genresMovieList(28);
  } catch (err) {
    console.error(err);
  }
}

// genres list
const genresMovieList = async (genres) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=7&with_genres=${genres}&with_original_language=en`, options);
    const data = await res.json();
    if (data.results.length === 0) {
      const noResult = document.createElement('p');
      noResult.innerText = `No Results Found :(`
      resultsSection.append(noResult);
    }
    suggestionSection.classList.remove('hide');
    paintingLists(data.results, "suggestion");
  } catch (err) {
    console.error(err);
  }
}

// getting image base_url, a file_size
const getImageUrl = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/configuration', options);
    const data = await res.json();
  } catch (err) {
    console.error(err);
  }
}

// painting trending movie and tv
const paintingLists = async (data, section) => {
  try {
    const lists= await data;

    if(searching === true) {
      resultsSection.classList.remove('hide');
      resultsList.innerHTML = "";
      tvSection.classList.add('hide');
      movieSection.classList.add('hide');
      suggestionSection.classList.add('hide');
    } else {
      resultsSection.classList.add('hide');
      tvSection.classList.remove('hide');
      movieSection.classList.remove('hide');
      // suggestionSection.classList.remove('hide');
    }

    if(section === "suggestion") {
      suggestionList.innerHTML = "";
      suggestionSection.classList.remove('hide');
    }

    await lists.forEach(element => {
      createItem(element, section);
    })
    // const movies = await trendingMovie();
    // const tvs = await trendingTv();
    https://image.tmdb.org/t/p/w200/${backdrop_path}
    // movies.forEach(movie => {
    //   createItem(movie);
    // });

    // tvs.forEach(tv => {
    //   createItem(tv);
    // })
    searching = false;
  } catch(err) {
    console.error(err);
  } finally {
    const movieItems = document.querySelectorAll('.item');
    movieItems.forEach((movieItem, index, arr) => {
      movieItem.addEventListener('click', handleModal);
    })
  }
}


const genresCheck = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options);
    const data = await res.json();
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

function changeMood(e) {
  const mood = e.currentTarget.dataset.id;
  if (mood === 'sun') {
    container.setAttribute('data-mood', 'sun');
    genresMovieList(53);
  } else if (mood === 'cloud') {
    container.classList.remove('dark');
    genresMovieList(10749);
  } else if (mood === 'snow') {
    genresMovieList(16);
  } else if (mood === 'rain') {
    genresMovieList(35);
  } else {
    genresMovieList(12);
  }
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
    suggestionSection.classList.remove('hide');
    genresMovieList(weatherGenres);
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

const handleHorizontalScroll = function (e) {
  // console.log(e.target.scrollLeft);
  // console.dir(e.target);
  const target = e.target;
  const targetWidth = e.target.scrollWidth - e.target.offsetWidth;

  if(targetWidth === target.scrollLeft) {
    e.target.parentElement.classList.add('right');
  } else if (target.scrollLeft === 0) {
    e.target.parentElement.classList.add('left');
  } else {
    e.target.parentElement.classList.remove('left');
    e.target.parentElement.classList.remove('right');
  }
}

const handleMoodBox = function(e) {
  const moodBox = e.currentTarget.parentElement;
  const moodBoxOpen = moodBox.classList.contains('open');
  if(moodBoxOpen) {
    moodBox.classList.remove('open');
  } else {
    moodBox.classList.add('open');
  }
}

const handleMouseover = function(e) {
  const lastItem = e.target.parentElement.parentElement;
  const scrollItem = lastItem.parentElement.parentElement;
  const lastItemLeft = lastItem.offsetLeft;
  const scrollBoxWidth = scrollItem.scrollWidth;

  // console.log(scrollBoxWidth, lastItemLeft)
  if(scrollBoxWidth - lastItemLeft < 200) {
    const lastItemPoint = scrollItem.scrollLeft + 200;
    // scrollItem.scrollLeft = 500;
    // console.log(scrollItem.scrollLeft)
  }
}

const handleHeader = function() {
  if(header.classList.contains('collapse')) {
    header.classList.remove('collapse');
  } else {
    header.classList.add('collapse');
  }
}

trendingMovie();
trendingTv();
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
searchForm.addEventListener('submit', handleSearch);
moodBoxControl.addEventListener('click', handleMoodBox);

moodsButton.forEach(button => {
  button.addEventListener('click', changeMood);
})

scrollElements.forEach(element => {
  element.addEventListener('scroll', handleHorizontalScroll);
  element.addEventListener('mouseover', handleMouseover);
})

headerExpandButton.addEventListener('click', handleHeader);

window.addEventListener('scroll', function(e) {
  if (window.scrollY > 50) {
    header.classList.add('collapse');
    headerExpandButton.classList.remove('hide');
  } else if (window.screenY === 0) {
    header.classList.remove('collapse');
    headerExpandButton.classList.add('hide');
  }

})