import {API_KEY_QUOTE} from "./config.js";

const container = document.querySelector('.container');

function writingQuotes(quote) {
  const line = quote.quote;
  const author = quote.author;

  const randomQuote = document.querySelector('.quote');
  randomQuote.querySelector('.line').innerText = `“${line}”`;
  randomQuote.querySelector('.author').innerText = `- ${author}`;
}

const movieQuotes = async () => {
  try {
    const res = await fetch('https://api.api-ninjas.com/v1/quotes?category=movies', {
      method: 'GET',
      headers: { 'X-Api-Key': `${API_KEY_QUOTE}`},
      contentType: 'application/json'
    });
    const data = await res.json();

    writingQuotes(data[0]);
  } catch(err) {
    console.error(err);
  }
}

movieQuotes(); // show quotes