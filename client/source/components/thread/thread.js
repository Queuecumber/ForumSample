define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        this.thread = ko.observable();

        this.activated.on(function (e, t)
        {
            this.thread(t);
        }.bind(this))
    };
});
