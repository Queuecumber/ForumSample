define(['knockout'], function (ko)
{
    var post = function ()
    {
        this.creator = ko.observable();

        this.title = ko.observable('');

        this.date = ko.observable();

        this.body = ko.observable('');
    };

    return post;
});
