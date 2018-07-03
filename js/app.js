var app = (() => {
    var $content = $('#content');

    var loadHome = (e) => {
        if (e) {
            e.preventDefault();
        }

        show.home();
    }

    var discover = (e) => {
        e.preventDefault();

        var page, item;

        while (!page || page === 0) {
            page = Math.floor(Math.random() * 50);
            item = Math.floor(Math.random() * 20);
        }

        tmdb.getRandomId(page, item);
    }


    var searchMovies = (title, pageNum) => {
        tmdb.search(title, pageNum);
    }

    var triggerSearchMovies = (e) => {
        if (e.type === 'keypress' && e.which !== 13) {
            return;
        }
        e.preventDefault();
        var title = $('#titleInput').val();
        if (title) {
            searchMovies(title, 1)
        }
    }

    var loadMovie = function (e) {
        e.preventDefault();
        var movieId = $(this).attr('movieID');
        tmdb.findMovieById(movieId);
    }


    var loadActor = function (e) {
        e.preventDefault();
        var actorId = $(this).attr('actorID');
        tmdb.findActorById(actorId);
    }

    //attach initial events
    $('#logo').on('click', loadHome);
    $('#discover').on('click', discover);
    $('#search').on('click', triggerSearchMovies);
    $('#titleInput').on('keypress', triggerSearchMovies);

    return {
        loadHome,
        discover,
        searchMovies,
        triggerSearchMovies,
        loadMovie,
        loadActor
    }
})();

app.loadHome();
