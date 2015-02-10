define(['crossroads'], function (crossroads)
{
    crossroads.addRoute('b/2');
    crossroads.addRoute('b/28');
    crossroads.routed.add(console.log, console);

    var parsePath = function (e)
    {
        var location = document.location.pathname;
        crossroads.parse(location);
    };

    window.onpopstate = parsePath;

    return {
        setPath: function(title, path)
        {
            history.pushState({}, title, path);
            parsePath(path);
        }
    };
});
