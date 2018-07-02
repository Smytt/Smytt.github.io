var render = (() => {

    var $content = $('#content');
    var $home = $('#home');
    var $movieHolder = $('#movie-bg');
    var $searchField = $home.find('input[type=text]');

    const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
    const NO_IMAGE = 'images/poster.png';

    var home = () => {
        $content.empty();
        $searchField.val('');
        $movieHolder.removeClass('movie').css('background-image', '');
        $home.show();
    }

    var results = (response) => {
        $content.empty();
        $movieHolder.removeClass('movie').css('background-image', '');

        var $results = $('<div>').addClass('results');

        var $ul = generatePagination();
        var resultsForPage = generateResultsForPage();

        $results.append($ul);
        $results.append(...resultsForPage);

        $content.append($results);

        function generatePagination() {
            var $ul = $('<ul>')
            if (response['page'] > 1) {
                $('<li>').append($('<a>')
                    .attr('id', 'prevPage')
                    .on('click', () => {
                        app.searchMovies($searchField.val(), response['page'] - 1)
                    })
                    .text('Previous')
                ).appendTo($ul)
            }

            if (response['page'] < response['total_pages']) {
                $('<li>').append($('<a>')
                    .attr('id', 'nextPage')
                    .on('click', () => {
                        app.searchMovies($searchField.val(), response['page'] + 1)
                    })
                    .text('Next')
                ).appendTo($ul)
            }

            return $ul;
        }
        function generateResultsForPage() {
            var results = [];

            for (var movie of response.results) {

                var poster =
                    movie['poster_path'] ?
                        '"' + IMAGE_BASE + movie['poster_path'] + '"' :
                        NO_IMAGE;

                var $yr = $('<span>').addClass('year').text(movie['release_date'].substr(0, 4));
                var $title = $('<span>').addClass('title').text(movie['title']);
                var $subtitle = $('<span>').addClass('subtitle').text(movie['overview']);

                var $smallPoster = $('<div>')
                    .addClass('small-poster')
                    .css('background-image', 'url(' + poster + ')');
                var $smallInfo = $('<div>')
                    .addClass("small-info")
                    .append($yr, $title, $subtitle)

                var $div = $('<div>')
                    .addClass('one-item')
                    .addClass('clearfix')
                    .attr('movieID', movie['id'])
                    .on('click', app.showMovie);

                $div.append($smallPoster)
                $div.append($smallInfo)

                results.push($div);
            }

            return results;
        }
    }

    var movie = (movie, castAndCrew) => {
        $content.empty();
        $home.hide();

        var $poster = generatePoster();
        var $section = generateMovieInfo();

        $content.append($poster)
        $content.append($section);

        function generateCastInfo() {
            var $castInfo = $('<div>')
                .addClass('more-info')
                .attr('id', 'cast-info')
                .css('display', 'none');

            var topActors = castAndCrew['cast'].slice(0, 20);

            for (var actor of topActors) {

                var photo =
                    actor['profile_path'] ?
                        '"' + IMAGE_BASE + actor['profile_path'] + '"' :
                        NO_IMAGE;

                var $oneItem = $('<div>')
                    .addClass('one-item')
                    .append($('<div>').css('background-image', 'url(' + photo + ')'))
                    .append($('<span>').addClass('title').text(actor['name']))
                    .append($('<span>').addClass('subtitle').text(actor['character']))


                $castInfo.append($oneItem);
            }

            return $castInfo;
        }
        function generateCrewInfo() {

            var $crewInfo = $('<div>')
                .addClass('more-info')
                .attr('id', 'crew-info')
                .css('display', 'none');

            var topCrew = castAndCrew['crew'].slice(0, 4);

            for (var member of topCrew) {
                $crewInfo.append($('<h3>').text(member['job']))
                $crewInfo.append($('<p>').text(member['name']))
            }

            return $crewInfo
        }
        function generateTriviaInfo() {
            var $triviaInfo = $('<div>')
                .addClass('more-info')
                .attr('id', 'trivia-info')
                .css('display', 'none');

            var topGenres = movie['genres']
                .map(x => x['name'])
                .slice(0, 10)
                .join(", ");

            var runtime = movie['runtime'] ?
                movie['runtime'] + ' minutes' :
                'unknown';

            var budget = movie['budget'] ?
                '$ ' + movie['budget'].toLocaleString('en') : 'unknown';

            var revenue = movie['revenue'] ?
                '$ ' + movie['revenue'].toLocaleString('en') : 'unknown';

            $triviaInfo.append($('<h3>').text('Runtime'))
            $triviaInfo.append($('<p>').text(runtime))
            $triviaInfo.append($('<h3>').text('Budget'))
            $triviaInfo.append($('<p>').text(budget))
            $triviaInfo.append($('<h3>').text('Revenue'))
            $triviaInfo.append($('<p>').text(revenue))
            $triviaInfo.append($('<h3>').text('Genres'))
            $triviaInfo.append($('<p>').text(topGenres))

            return $triviaInfo;
        }
        function generateMovieInfo() {

            var $section = $('<section>').addClass('movie-info');

            var title = movie['title'].length > 25 ?
                movie['title'].substring(0, 25) + '...' :
                movie['title'];

            var $title = $('<h1>').text(title);
            var $year = $('<span>').text(movie['release_date'].substr(0, 4)).appendTo($title);
            var $description = $('<p>').addClass('description').text(movie['overview']);
            var $fullTitle = $('<strong>').addClass('full-title').text('Full title: ' + movie['title']);

            var $tabs = $('<ul>')
                .append($('<li>').append($('<a>').attr('id', 'cast').text('Cast').on('click', switchInfo)))
                .append($('<li>').append($('<a>').attr('id', 'crew').text('Crew').on('click', switchInfo)))
                .append($('<li>').append($('<a>').attr('id', 'trivia').text('Trivia').on('click', switchInfo)))

            var $castInfo = generateCastInfo();
            var $crewInfo = generateCrewInfo();
            var $triviaInfo = generateTriviaInfo();

            $section.append($title, $description, $fullTitle, $tabs, $castInfo, $crewInfo, $triviaInfo)

            return $section;
        }
        function generatePoster() {
            var poster =
                movie['poster_path'] ?
                    '"' + IMAGE_BASE + movie['poster_path'] + '"' :
                    NO_IMAGE;

            $movieHolder.addClass('movie').css('background-image', 'url(' + poster + ')')

            var $poster = $("<div>")
                .addClass('poster')
                .css('background-image', 'url(' + poster + ')')

            return $poster;
        }

    }

    function switchInfo() {

        var $currentInfo = $('.current-info');

        //generate tabId from clicked link
        var tabId = '#' + $(this).attr('id') + '-info';

        //check if this is the initial click
        if ($currentInfo.length === 0) {
            $(tabId).fadeIn(300).addClass('current-info');
            $(this).addClass('current');
            return;
        }

        //switch from one tab to another
        $(this).closest('ul').find('.current').removeClass('current');
        $(this).addClass('current');
        $currentInfo
            .removeClass('current-info')
            .fadeOut(300, () => {
                $(tabId).fadeIn(300).addClass('current-info');
            });

    }

    return {
        home,
        results,
        movie
    }
})();