define(['crossroads'], function (crossroads)
{
    crossroads.addRoute('b/{id}');
    crossroads.addRoute('/');
    crossroads.routed.add(console.log, console);

    var parsePath = function ()
    {
        var location = document.location.pathname;
        crossroads.parse(location);
    };

    window.onpopstate = parsePath;

    return {
        init: function ()
        {
            parsePath();
        },

        setPath: function(title, path)
        {
            history.pushState({}, title, path);
            parsePath(path);
        }
    };
});
