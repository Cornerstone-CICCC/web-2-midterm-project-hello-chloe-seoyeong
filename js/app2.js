const charts = document.querySelector('.charts');
const searchForm = document.getElementById('form');
const searchInput = searchForm.querySelector('input[type="text"');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNTU2NzRkMWM5ODZlMWNiNjFhOTM3MjcwYzgwMzJjNiIsIm5iZiI6MTczMjkwNzI4OC4xNTM5OTk4LCJzdWIiOiI2NzRhMTExOGU1MmYzZjNhM2M2ODYzYWEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-DPOT6prYtKgg-DTvfj2rXhJ0vz8Aj3MRR6aEuIZ-Qs'
  }
};

fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));

// start: image base_url, a file_size
const configOptions = {method: 'GET', headers: {accept: 'application/json'}};

fetch('https://api.themoviedb.org/3/configuration', configOptions)
  .then(res => res.json())
  .then(res => {
    console.log(res);
  })
  .catch(err => console.error(err));
// end: image base_url, a file_size

