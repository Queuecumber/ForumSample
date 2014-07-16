define(['knockout'], function (ko)
{
    var board = function ()
    {
        this.creator = ko.observable();

        this.title = ko.observable('');

        this.boards = ko.observableArray([]);

        this.threads = ko.observableArray([]);
    };

    return board;
});
