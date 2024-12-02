const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTU2NzRkMWM5ODZlMWNiNjFhOTM3MjcwYzgwMzJjNiIsIm5iZiI6MTczMjkwNzI4OC4xNTM5OTk4LCJzdWIiOiI2NzRhMTExOGU1MmYzZjNhM2M2ODYzYWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-DPOT6prYtKgg-DTvfj2rXhJ0vz8Aj3MRR6aEuIZ-Qs'
  }
};

// getting trending moive
const trendingMovie = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

trendingMovie();

// getting trending tv
const trendingTv = async () => {
  try {
    const res = await fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options);
    const data = await res.json();
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
