define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        var self = this;

        self.thread = ko.observable();

        self.activated.on(function (e, t)
        {
            self.thread(t);
        })
    };
};
