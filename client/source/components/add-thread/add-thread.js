define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        this.blankThread = function ()
        {
            return {
                title: ko.observable(''),
                creator: 'test@test.net',
                defaultPermission: 0,
                posts: []
            };
        };

        this.blankPost = function ()
        {
            return {
                title: ko.observable(''),
                creator: 'test@test.net',
                body: ko.observable('')
            };
        };

        this.thread = ko.observable();

        this.activated.on(function ()
        {
            var blankThread = this.blankThread();

            blankThread.posts = [this.blankPost()];

            this.thread(blankThread);
        }.bind(this));

        this.loaded.on(function ()
        {
            this.view().on('click', '.cancel', function ()
            {
                this.finish();
            }.bind(this));

            this.view().on('click', '.add', function ()
            {
                this.finish(ko.toJS(this.thread));
            }.bind(this));

            this.view().on('submit', 'form', function () { return false; });
        }.bind(this));
    };
});
