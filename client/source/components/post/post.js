define(['knockout', 'application'], function (ko, application)
{
    return function ()
    {
        self.post = ko.observable();

        self.activated.on(function (event, p)
        {
            self.post(p);
        });
    };
});
