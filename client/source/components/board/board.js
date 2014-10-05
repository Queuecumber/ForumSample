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
            if(b.id)
            {
                history.pushState(null, null, window.location.href + 'b/' + b.id + '/');
            }

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
        }.bind(this));
    };
});
