define(['knockout'], function (ko)
{
    var thread = function ()
    {
        this.creator = ko.observable();

        this.posts = ko.observableArray([]);
    };

    return thread;
});
