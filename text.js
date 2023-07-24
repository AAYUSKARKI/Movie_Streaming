// constants
const apikey = "26da8c157615de0c862e1ee684dd2ce0";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtube_api = "AIzaSyC3ZrYMBkCPBHKs5dlp0cpgyKCPlEdznfY";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}&language=en-US`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtube_api}`,
};
//functions
function searchMovieTrailer(movieName, iframId) {
  if (!movieName) return;
  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const bestResult = res.items[0];
      const elements = document.getElementById(iframId);
      console.log(elements, iframId);
      const div = document.createElement("div");
      div.innerHTML = `<iframe width="245px" height="150px" allowfullscreen="true" src="https://www.youtube.com/embed/${bestResult.id.videoId}?&autoplay=1&mute=1&controls=1"></iframe>`;
      elements.append(div);
    })
    .catch(err=>console.log(err));
}

// boots up app
function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPaths.fetchTrending, "TrendingNow")
    .then((list) => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}

function buildBannerSection(movie) {
  const bannercont = document.getElementById("banner-section");
  bannercont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
  const div = document.createElement("div");
  div.innerHTML = `
  <h2 class="banner_title">${movie.title ?? ""}</h2>
  <p class="banner_info">Trending in Movies | Released - ${
    movie.release_date ?? ""
  }</p>
  <p class="banner_Overview">${
    movie.overview && movie.overview.length > 200
      ? movie.overview.slice(0, 200).trim() + "..."
      : movie.overview
  }</p>
  <div class="action-buttons-const">
  <button class="action-button">Play</button>
  <button class="action-button">More Info</button>
  </div>
  `;
  div.className = "banner-content container";
  bannercont.append(div);
}
function livesearch() {
  let cards = document.querySelectorAll(".movie-item");
  let search_query = document.getElementById("searchbox").value;
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].innerText.toLowerCase().includes(search_query.toLowerCase())) {
      cards[i].classList.remove("is-hidden");
    } else {
      cards[i].classList.add("is-hidden");
    }
  }
}

function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      // check if array
      if (Array.isArray(categories) && categories.length) {
        categories.slice(0, 4).forEach((category, i) => {
          // categories.slice(0,3).forEach((category, i) => {
          // fetchAndbuildMovieSection(category);
          fetchAndbuildMovieSection(
            apiPaths.fetchMoviesList(category.id),
            category.name
          );
        });
      } // check if array and not empty
      // console.table(categories);
    })
    .catch((err) => console.error("error from api", err));
}
// fetch and buildMovieSection
function fetchAndbuildMovieSection(fetchUrl, categoryName) {
  // console.log('category', category, fetchUrl);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies.slice(0, 6), categoryName);
      }
      return movies;
      // const {results} = res;
    })
    .catch((err) => console.error("error from api", err));
}

// build movies section
function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);

  const moviesCont = document.getElementById("movies-cont");

  const moviesListHTML = list
    .map((item) => {
      return `
      <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
          <img class="move-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}" />
          <div class="iframe-wrap" id="yt${item.id}"></div>
          <span class="movie-name">${item.title}</span>
      </div>`;
    })
    .join("");

  const moviesSectionHTML = `
      <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></span></h2>
      <div class="movies-row">
          ${moviesListHTML}
      </div>
  `;

  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;

  // append html into movies container
  moviesCont.append(div);
}
window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});

//AIzaSyC3ZrYMBkCPBHKs5dlp0cpgyKCPlEdznfY
// function init()
// {
//   fetchTrendingMovies();
//   fetchAndBuildAllSections();
// }
