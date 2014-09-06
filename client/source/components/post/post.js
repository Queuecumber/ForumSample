define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        var self = this;

        self.post = ko.observable();

        self.activated.on(function (e, p)
        {
            self.post(p);
        });
    };
});
