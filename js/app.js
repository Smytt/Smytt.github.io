app = (() => {

    var loadHome = (e) => {
        if (e) {
            e.preventDefault();
        }
        htmlBuilder.home();
    }

    var discover = (e) => {
        e.preventDefault();
        tmdb.getRandomId();
    }

    var searchMovies = () => {
        var title = $('#titleInput').val();
        tmdb.search(title, 1);
    }

    var showMovie = function (e) {
        var movieId = $(this).attr('movieID');
        tmdb.findById(movieId);
    }

    //attach initial events
    $('#logo').on('click', loadHome);
    $('#discover').on('click', discover);
    $('#search').on('click', searchMovies);

    return {
        loadHome,
        discover,
        searchMovies,
        showMovie
    }
})();

app.loadHome();
