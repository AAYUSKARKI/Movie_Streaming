//AIzaSyC3ZrYMBkCPBHKs5dlp0cpgyKCPlEdznfY
const apiPaths= {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
  }

  //Boots up app
  function init()
  {
    fetchTrendingMovies();
    fetchAndBuildAllSections();
  }