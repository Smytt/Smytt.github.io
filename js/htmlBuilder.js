var htmlBuilder = (() => {

    var $content = $('#content');
    var $home = $('#home');
    var $movieHolder = $('#movie-bg');

    var switchInfo = function () {

        //generate tabId from clicked link
        var tabId = '#' + $(this).attr('id') + '-info';

        //check if this is the initial click
        if ($('.current-info').length === 0) {
            $(tabId).fadeIn(300).addClass('current-info');
            return;
        }

        //switch from one tab to another
        $(this).closest('ul').find('.current').removeClass('current');
        $(this).addClass('current');
        $('.current-info')
            .removeClass('current-info')
            .fadeOut(300, () => {
                $(tabId).fadeIn(300).addClass('current-info');
            });

    }

    var home = () => {
        $content.empty();
        $home.find('input[type=text]').val('');
        $movieHolder.removeClass('movie').css('background-image', '');
        $home.show();

    }

    var results = (response) => {
        $content.empty();

        var $ul = $('<ul>')
        if (response['page'] > 1) {
            $('<li>').append($('<a>')
                .attr('id', 'prevPage')
                .on('click', () => {
                    app.searchMovies($home.find('input[type=text]').val(), response['page'] - 1)
                })
                .text('Previous')
            ).appendTo($ul)
        }
        if (response['page'] < response['total_pages']) {
            $('<li>').append($('<a>')
                .attr('id', 'nextPage')
                .on('click', () => {
                    app.searchMovies($home.find('input[type=text]').val(), response['page'] + 1)
                })
                .text('Next')
            ).appendTo($ul)
        }

        var $results = $('<div>').addClass('results');
        $results.append($ul);

        for (var movie of response.results) {
            var $div = $('<div>')
                .addClass('one-item')
                .addClass('clearfix')
                .attr('movieID', movie['id'])
                .on('click', app.showMovie);

            var poster = movie['poster_path'] ? '"https://image.tmdb.org/t/p/w500' + movie['poster_path'] + '"' : 'images/poster.png';

            $div.append($('<div>').addClass('small-poster').css('background-image', 'url(' + poster + ')'))
            var $yr = $('<span>').addClass('year').text(movie['release_date'].substr(0, 4));
            var $title = $('<span>').addClass('title').text(movie['title']);
            var $subtitle = $('<span>').addClass('subtitle').text(movie['overview']);

            $div.append($('<div>').addClass("small-info").append($yr, $title, $subtitle))

            $results.append($div)
        }

        $content.append($results);
    }

    var movie = (movie, castAndCrew) => {
        $content.empty();
        $home.hide();

        var poster = movie['poster_path'] ? '"https://image.tmdb.org/t/p/w500' + movie['poster_path'] + '"' : 'images/poster.png';
        $movieHolder.addClass('movie').css('background-image', 'url(' + poster + ')')

        $content.append($("<div>")
            .addClass('poster')
            .css('background-image', 'url(' + poster + ')'))

        var $section = $('<section>').addClass('movie-info');

        $section
            .append($('<h1>').text(movie['title']).append($('<span>').text(movie['release_date'].substr(0, 4))))
            .append($('<p>').addClass('description').text(movie['overview']))

        $('<ul>')
            .append($('<li>').append($('<a>').attr('id', 'cast').text('Cast').on('click', switchInfo)))
            .append($('<li>').append($('<a>').attr('id', 'crew').text('Crew').on('click', switchInfo)))
            .append($('<li>').append($('<a>').attr('id', 'trivia').text('Trivia').on('click', switchInfo)))
            .appendTo($section);

        var $castInfo = $('<div>').addClass('more-info').attr('id', 'cast-info').css('display', 'none');
        for (var actor of castAndCrew['cast'].slice(0, 20)) {
            var photo = actor['profile_path'] ? '"https://image.tmdb.org/t/p/w500' + actor['profile_path'] + '"' : 'images/poster.png';
            $('<div>').addClass('one-item')
                .append($('<div>').css('background-image', 'url(' + photo + ')'))
                .append($('<span>').addClass('title').text(actor['name']))
                .append($('<span>').addClass('subtitle').text(actor['character']))
                .appendTo($castInfo)
        }
        $castInfo.appendTo($section);

        var $crewInfo = $('<div>').addClass('more-info').attr('id', 'crew-info').css('display', 'none');
        for (var member of castAndCrew['crew'].slice(0, 4)) {
            $crewInfo.append($('<h3>').text(member['job']))
            $crewInfo.append($('<p>').text(member['name']))
        }
        $crewInfo.appendTo($section);

        var $triviaInfo = $('<div>').addClass('more-info').attr('id', 'trivia-info').css('display', 'none');
        $triviaInfo.append($('<h3>').text('Runtime'))
        $triviaInfo.append($('<p>').text(movie['runtime'] + ' minutes'))
        $triviaInfo.append($('<h3>').text('Budget'))
        $triviaInfo.append($('<p>').text('$ ' + movie['budget'].toLocaleString('en')))
        $triviaInfo.append($('<h3>').text('Revenue'))
        $triviaInfo.append($('<p>').text('$ ' + movie['revenue'].toLocaleString('en')))
        $triviaInfo.append($('<h3>').text('Genres'))
        $triviaInfo.append($('<p>').text(movie['genres'].map(x => x['name']).slice(0, 10).join(", ")))
        $triviaInfo.appendTo($section);

        $content.append($section);

    }

    return {
        home,
        results,
        movie
    }
})();