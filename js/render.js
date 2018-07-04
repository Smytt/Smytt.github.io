var render = (() => {

    const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
    const NO_IMAGE = 'images/poster.png';

    var results = (response) => {

        var results = {
            movies: [],
            total: response['total_results'].toLocaleString('en'),
            nextPage: null,
            prevPage: null,
            hasPages: false
        }

        response.results.forEach(movie => {
            results.movies.push({
                poster: movie['poster_path'] ?
                    '"' + IMAGE_BASE + movie['poster_path'] + '"' :
                    NO_IMAGE,
                year: movie['release_date'].substr(0, 4),
                title: movie['title'],
                description: movie['overview'],
                id: movie['id'],
            })
        })

        results.nextPage = response['total_pages'] > response['page'] ? response['page'] + 1 : null;
        results.prevPage = 1 < response['page'] ? response['page'] - 1 : null;
        results.hasPages = results.nextPage || results.prevPage;

        show.results(results);
    }

    var movie = (movie, castAndCrew) => {

        var movie = {
            poster: movie['poster_path'] ?
                '"' + IMAGE_BASE + movie['poster_path'] + '"' :
                NO_IMAGE,
            title: movie['title'].length > 25 ?
                movie['title'].substring(0, 25) + '...' :
                movie['title'],
            year: movie['release_date'].substr(0, 4),
            description: movie['overview'],
            fullTitle: movie['title'],
            actors: [],
            crew: [],
            genres: movie['genres']
                .map(x => x['name'])
                .slice(0, 10)
                .join(", "),
            runtime: movie['runtime'] ?
                movie['runtime'] + ' minutes' :
                'unknown',
            budget: movie['budget'] ?
                '$ ' + movie['budget'].toLocaleString('en') : 'unknown',
            revenue: movie['revenue'] ?
                '$ ' + movie['revenue'].toLocaleString('en') : 'unknown',
        }

        var actors = castAndCrew['cast'].slice(0, 20);
        actors.forEach(actor => {
            movie.actors.push({
                photo: actor['profile_path'] ?
                    '"' + IMAGE_BASE + actor['profile_path'] + '"' :
                    NO_IMAGE,
                name: actor['name'],
                character: actor['character'],
                id: actor['id']
            })
        })

        var crew = castAndCrew['crew'].slice(0, 4);
        crew.forEach(member => {
            movie.crew.push({
                job: member['job'],
                name: member['name']
            })
        })

        show.movie(movie);
    }

    var actor = (actor) => {
        var actor = {
            name: actor['name'],
            bio: actor['biography'],
            image: actor['profile_path'] ?
                '"' + IMAGE_BASE + actor['profile_path'] + '"' :
                NO_IMAGE,
        }
        show.actor(actor);
    }

    return {
        results,
        movie,
        actor
    }
})();