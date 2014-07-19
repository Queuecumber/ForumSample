define(['knockout'], function (ko)
{
    var user = function ()
    {
        self.name = ko.observable('');

        self.email = ko.observable('');

        self.privilege = ko.observable(); 
    };

    return user;
});
