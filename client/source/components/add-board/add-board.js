define(['knockout', 'application', 'board'], function (ko, application, Board)
{
    return function ()
    {
        this.blankBoard = function ()
        {
            return {
                title: ko.observable(''),
                creator: 'test@test.net',
                defaultPermission: 0
            };
        };

        this.board = ko.observable();

        this.activated.on(function ()
        {
            this.board(this.blankBoard());
        }.bind(this));

        this.loaded.on(function ()
        {
            this.view().on('click', '.cancel', function ()
            {
                this.finish();
            }.bind(this));

            this.view().on('click', '.add', function ()
            {
                this.finish(ko.toJS(this.board));
            }.bind(this));

            this.view().on('submit', 'form', function () { return false; });
        }.bind(this));
    };
});
