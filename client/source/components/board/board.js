define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        this.model = ko.observable(null);

        this.model.subscribe(function (root)
        {
            root.sync();
        });

        this.activated.on(function (e, b)
        {
            this.model(b);
        }.bind(this));

        this.loaded.on(function ()
        {
            this.view().on('click', '.board', function (e)
            {
                var boardItem = ko.dataFor(e.target);

                application.boards().activate(boardItem);
            });
        }.bind(this));
    };
});
