define(['knockout'], function (ko)
{
    return function (initialValues, settings)
    {
        var values = ko.observableArray(initialValues);

        var face = ko.computed(function ()
        {
            return values();
        });

        face.push = function (val)
        {
            var channel = settings.channel + settings.delta.added;

            settings.socket.emit('downstream', {
                channel: channel,
                data: 'serialize' in val ? val.serialize() : val
            });
        };

        face.remove = function (val)
        {
            var channel = settings.channel + settings.delta.removed;

            settings.socket.emit('downstream', {
                channel: channel,
                data: 'serialize' in val ? val.serialize() : val
            });
        };

        // Upstream add (server->client)
        var deltaAdd = function (val)
        {
            if('modeler' in settings)
                val = new settings.modeler(val);

            values.push(val);
        };
        settings.socket.on(settings.channel + settings.delta.added, deltaAdd);

        // Upstream remove (server->client)
        var deltaRemove = function (val)
        {
            values.remove(function (v) { return v.id == val.id; });
        };
        settings.socket.on(settings.channel + settings.delta.removed, deltaRemove);

        return face;
    };
});
