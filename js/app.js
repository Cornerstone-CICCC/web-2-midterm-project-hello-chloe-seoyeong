const moiveList = document.querySelector('.movie');
const tvList = document.querySelector('.tv');
const results = document.querySelector('.results');
const searchForm = document.getElementById('form');
const searchInput = searchForm.querySelector('input[type="text"');

let SEARCHING = false;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTU2NzRkMWM5ODZlMWNiNjFhOTM3MjcwYzgwMzJjNiIsIm5iZiI6MTczMjkwNzI4OC4xNTM5OTk4LCJzdWIiOiI2NzRhMTExOGU1MmYzZjNhM2M2ODYzYWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-DPOT6prYtKgg-DTvfj2rXhJ0vz8Aj3MRR6aEuIZ-Qs'
  }
};

function createItem(item) {
  // if(!item.poster_path) {
  //   item.poster_path = `https://placehold.co/200x300`;
  // }
  let itemObject = {
    title: "",
    overview: item.overview,
    posterPath: item.poster_path,
    mediaType: item.media_type
  };

  if(itemObject.mediaType === "movie") {
    itemObject.title = item.title;
  } else {
    itemObject.title = item.name;
  }

  const {title, overview, posterPath, mediaType} = itemObject;
  const itemDiv = document.createElement('div');
  let imageUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;

  if(imageUrl === "https://image.tmdb.org/t/p/w200null") {
    imageUrl = `https://placehold.co/200x300`;
  }

  if(mediaType === "tv" || mediaType === "movie") {
    itemDiv.classList.add('item');
    itemDiv.innerHTML = `
      <div class="item__image">
        <img src="${imageUrl}" alt="${mediaType} image">
      </div>
      <h2>${title}</h2>
      <p>${overview}</p>
      `;
  }

  if(SEARCHING == true) {
    results.append(itemDiv);
  } else {
    if(mediaType === "tv") {
      tvList.append(itemDiv);
    } else {
      moiveList.append(itemDiv);
    }
  }

}

// getting trending moive
const trendingMovie = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options);
    const data = await res.json();
    paintingTrending(data.results);
    // return data.results;
  } catch (err) {
    console.error(err);
  }
}

// getting trending tv
const trendingTv = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options);
    const data = await res.json();
    paintingTrending(data.results);
    // return data.results;
  } catch (err) {
    console.error(err);
  }
}

// searching keyword
const searchKeyword = async (keyword) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${keyword}&include_adult=false&language=en-US&page=1`, options);
    const data = await res.json();
    console.log(data.results);
    paintingTrending(data.results);
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
const paintingTrending = async (data) => {
  const lists= await data;

  if(SEARCHING === true) {
    results.innerHTML = "";
    tvList.classList.add('hide');
    moiveList.classList.add('hide');
  }

  lists.forEach(element => {
    createItem(element);
  })

  // const movies = await trendingMovie();
  // const tvs = await trendingTv();

  // movies.forEach(movie => {
  //   createItem(movie);
  // });

  // tvs.forEach(tv => {
  //   createItem(tv);
  // })
}

function handleSearch(e) {
  e.preventDefault();
  const searchWord = searchInput.value;
  SEARCHING = true;
  searchKeyword(searchWord);
  searchInput.value = "";
}

searchForm.addEventListener('submit', handleSearch);
// paintingTrending();
trendingMovie();
trendingTv();