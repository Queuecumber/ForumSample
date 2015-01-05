define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        this.post = ko.observable();

        this.activated.on(function (e, p)
        {
            this.post(p);
        }.bind(this));
    };
});
