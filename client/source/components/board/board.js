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

            this.view().on('click', '.add-board', function ()
            {
                this.addBoard().activate();
            }.bind(this));

            this.addBoard().finished.on(function (e, b)
            {
                if(b)
                {
                    b.parentBoard = this.model().id;
                    this.model().boards.push(b);
                }
            }.bind(this));
        }.bind(this));
    };
});
