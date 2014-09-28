define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        this.boards = ko.observableArray();
        this.threads = ko.observableArray();

        this.activated.on(function (e, b)
        {
            if(b !== undefined)
            {
                this.boards(b.boards());
                this.threads(b.threads());
            }
            else
            {
                this.boards(application.model().boards());
            }
        }.bind(this));
    };
});
