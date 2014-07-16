define(['knockout'], function (ko)
{
    var model = function()
    {
        this.forums = ko.observableArray([]);
    };

    return model;
};
