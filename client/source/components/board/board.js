define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        this.modelRoot = ko.observable(null);

        this.boards = ko.computed(function ()
        {
            if(this.modelRoot())
            {
                return this.modelRoot().boards();
            }
            else
            {
                return [];
            }
        }.bind(this));

        this.threads = ko.computed(function ()
        {
            if(this.modelRoot())
            {
                return this.modelRoot().threads();
            }
            else
            {
                return [];
            }
        }.bind(this));

        this.modelRoot.subscribe(function (root)
        {
            root.sync();
        });

        this.activated.on(function (e, b)
        {
            this.modelRoot(b);
        }.bind(this));
    };
});
