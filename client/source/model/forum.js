define(['knockout'], function (ko)
{
    var forum = function ()
    {
        this.creator = ko.observable();

        this.title = ko.observable('');

        this.boards = ko.observableArray([]);
    };
});
