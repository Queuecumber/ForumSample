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
                application.boards().activate(e.binding);
            });

            this.view().on('click', '.add-board', function ()
            {
                this.view().find('.add-board').hide();
                this.addBoard().activate();
            }.bind(this));

            this.addBoard().finished.on(function (e, b)
            {
                this.view().find('.add-board').show();

                if(b)
                {
                    b.parentBoard = this.model().id;
                    this.model().boards.push(b);
                }
            }.bind(this));

            this.view().on('click', '.add-thread', function ()
            {
                this.view().find('.add-thread').hide();
                this.addThread().activate();
            }.bind(this));

            this.addThread().finished.on(function (e, t)
            {
                this.view().find('.add-thread').show();

                if(t)
                {
                    t.board = this.model().id;
                    this.model().threads.push(t);
                }
            }.bind(this));
        }.bind(this));
    };
});
