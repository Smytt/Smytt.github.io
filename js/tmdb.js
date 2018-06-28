tmdb = (() => {

    var base = 'https://api.themoviedb.org/3';

    var api = '?api_key=';
    var key = 'b75a086ec6e11c142e5abb302788ad20';

    var searchMovie = '/search/movie';
    var findOne = '/movie/';
    var credits = '/credits';
    var discover = '/discover/movie'

    var query = '&query=';
    var page = '&page=';
    var sort = '&sort_by=popularity.desc';

    var search = (title, pageNum) => {
        $.ajax({
            type: 'GET',
            url: base + searchMovie + api + key + query + title + page + pageNum,
            success: (data) => {
                htmlBuilder.results(data, pageNum);
            },
            error: () => {
                console.log("Could not retrieve movie list");
            },
        })
    }

    var findById = (id) => {
        var castAndCrew;

        $.ajax({
            type: 'GET',
            url: base + findOne + id + credits + api + key,
            success: (data) => {
                castAndCrew = data;
            },
            error: () => {
                console.log("Could not retrieve movie cast and crew");
            },
        })

        $.ajax({
            type: 'GET',
            url: base + findOne + id + api + key,
            success: (data) => {
                console.log(castAndCrew);
                htmlBuilder.movie(data, castAndCrew);
            },
            error: () => {
                console.log("Could not retrieve movie details");
            },
        })
    }

    var getRandomId = () => {
        var rndPage = Math.floor(Math.random()*50);
        var rndItem = Math.floor(Math.random()*20);
        $.ajax({
            type: 'GET',
            url: base + discover + api + key + sort + page + rndPage,
            success: (data) => {
                findById(data['results'][rndItem]['id']);
            },
            error: () => {
                console.log("Could not retrieve total movies count");
            },
        })
    }

    return {
        search,
        findById,
        getRandomId
    }
})();