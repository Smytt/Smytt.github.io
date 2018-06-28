htmlBuilder = (() => {

    var $content = $('#content');
    var $home = $('#home');
    var $movieHolder = $('#movie-bg');

    var selectedMovie;
    var movieCastAndCrew;

    var showCast = function () {
        $(this).closest('ul').find('.current').removeClass('current');
        $(this).addClass('current');
        $('.more-info').hide();
        $('#cast-info').show();
    }
    var showCrew = function () {
        $(this).closest('ul').find('.current').removeClass('current');
        $(this).addClass('current');
        $('.more-info').hide();
        $('#crew-info').show();
    }

    var showTrivia = function () {
        $(this).closest('ul').find('.current').removeClass('current');
        $(this).addClass('current');
        $('.more-info').hide();
        $('#trivia-info').show();
    }

    var home = () => {
        $content.empty();
        $home.find('input[type=text]').val('');
        $movieHolder.removeClass('movie').css('background-image', '');
        $home.show();

    }

    var results = (movies, pageNum) => {
        $content.empty();

        var $ul = $('<ul>')
        if (pageNum > 1) {
            $('<li>').append($('<a>').attr('id', 'prevPage').text('Previous')).appendTo($ul)
        }
        if (pageNum < movies['total_pages']) {
            $('<li>').append($('<a>').attr('id', 'nextPage').text('Next')).appendTo($ul)
        }

        var $results = $('<div>').addClass('results');
        $results.append($ul);

        for (var movie of movies.results) {
            var $div = $('<div>')
                .addClass('one-item')
                .addClass('clearfix')
                .attr('movieID', movie['id'])
                .on('click', app.showMovie);

            if (movie['poster_path']) {
                $div.append($('<img>').attr('src', 'https://image.tmdb.org/t/p/w500' + movie['poster_path']))
                var $yr = $('<span>').addClass('year').text(movie['release_date'].substr(0, 4));
                var $title = $('<span>').addClass('title').text(movie['title']);
                var $subtitle = $('<span>').addClass('subtitle').text(movie['overview']);

                $div.append($('<div>').addClass("small-info").append($yr, $title, $subtitle))
            }
            $results.append($div)
        }

        $content.append($results);
    }

    var movie = (movie, castAndCrew) => {
        $content.empty();
        $home.hide();

        $movieHolder.addClass('movie').css('background-image', 'url("https://image.tmdb.org/t/p/w500' + movie['poster_path'] + '")')

        $content.append($("<img>")
            .addClass('poster')
            .attr('src', 'https://image.tmdb.org/t/p/w500' + movie['poster_path']))

        var $section = $('<section>').addClass('movie-info');

        $section
            .append($('<h1>').text(movie['title']).append($('<span>').text(movie['release_date'].substr(0, 4))))
            .append($('<p>').addClass('description').text(movie['overview']))

        $('<ul>')
            .append($('<li>').append($('<a>').attr('id', 'cast').text('Cast').on('click', showCast)))
            .append($('<li>').append($('<a>').attr('id', 'crew').text('Crew').on('click', showCrew)))
            .append($('<li>').append($('<a>').attr('id', 'trivia').text('Trivia').on('click', showTrivia)))
            .appendTo($section);

        var $castInfo = $('<div>').addClass('more-info').attr('id', 'cast-info').css('display', 'none');
        for (var actor of castAndCrew['cast'].slice(0,10)) {
            $('<div>').addClass('one-item')
                .append($('<img>').attr('src', actor['profile_path'] ? 'https://image.tmdb.org/t/p/w500' + actor['profile_path'] : ''))
                .append($('<span>').addClass('title').text(actor['name']))
                .append($('<span>').addClass('subtitle').text(actor['character']))
                .appendTo($castInfo)
        }
        $castInfo.appendTo($section);

        var $crewInfo = $('<div>').addClass('more-info').attr('id', 'crew-info').css('display', 'none');
        for (var member of castAndCrew['crew'].slice(0,4)) {
            $crewInfo.append($('<h3>').text(member['job']))
            $crewInfo.append($('<p>').text(member['name']))
        }
        $crewInfo.appendTo($section);

        var $triviaInfo = $('<div>').addClass('more-info').attr('id', 'trivia-info').css('display', 'none');
        $triviaInfo.append($('<h3>').text('Runtime'))
        $triviaInfo.append($('<p>').text(movie['runtime'] + 'minutes'))
        $triviaInfo.append($('<h3>').text('Budget'))
        $triviaInfo.append($('<p>').text('$ ' + movie['budget'].toLocaleString('en')))
        $triviaInfo.append($('<h3>').text('Revenue'))
        $triviaInfo.append($('<p>').text('$ ' + movie['revenue'].toLocaleString('en')))
        $triviaInfo.appendTo($section);

        $content.append($section);

    }

    return {
        home,
        results,
        movie
    }
})();