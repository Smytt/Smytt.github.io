var show = (() => {

    var $content = $('#content');
    var $home = $('#home');
    var $searchField = $home.find('input[type=text]');

    var home = () => {
        $content.empty();
        $searchField.val('');
        $home.show();
    }

    var movie = (movie) => {
        $.ajax({
                url: './templates/movie.html',
                success: (tmpl) => {
                    var $movie = Mustache.render(tmpl, movie);
                    $content.empty();
                    $home.hide();
                    $content.append($movie);
                    $content.find('.movie-info ul a').on('click', switchInfo);
                },
                error: () => {
                console.log("Could not load movie template");
            },
        })
    }

    var results = (results) => {
        $.ajax({
            url: './templates/results.html',
            success: (tmpl) => {
                var $results = Mustache.render(tmpl, results);
                $content.empty();
                $content.append($results)
                $content.find('ul a').on('click', function () {
                    app.searchMovies($searchField.val(), $(this).attr('pageNum'))
                })
                $content.find('.results .one-item').on('click', app.showMovie)
            },
            error: () => {
                console.log("Could not load results template");
            },
        })
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
        results,
        movie,
        home,
    }
})()
