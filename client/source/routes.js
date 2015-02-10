define(['crossroads'], function (crossroads)
{
    window.onpopstate = function (e)
    {
        var location = document.location.pathname;
        crossroads.parse(location);
    };

    crossroads.addRoute('b/2');
    crossroads.addRoute('b/28');
    crossroads.routed.add(console.log, console);    
});
