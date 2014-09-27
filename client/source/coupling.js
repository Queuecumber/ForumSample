define(['knockout'], function (ko)
{
    ko.extenders.coupling = function (target, settings)
    {
        if(!'socket' in settings)
            throw new Error('Coupled observables require a socket for communication');

        if(!'channel' in settings)
            throw new Error('Coupled observables require a channel to communicate on');

        target = target.extend({current: 'downstream'});

        // Scalar update
        if('updated' in settings)
        {
            if(!'event' in settings.updated)
                throw new Error('Coupled scalar missing updated event name');

            // Upstream update (server->client)
            settings.socket.on(settings.channel + settings.updated.event, function (updated)
            {
                if('property' in settings.updated)
                    target.upstream(updated[settings.updated.property]);
                else
                    target.upstream(updated);
            });

            // Downstream update (client->server)
            target.subscribe(function (updated)
            {
                if('property' in settings.updated)
                {
                    socket.emit('downstream', {
                        channel: settings.channel + settings.updated.event,
                        change: {
                            property: settings.updated.property,
                            value: 'serialize' in updated ? updated.serialize() : updated
                        }
                    });
                }
                else
                {
                    socket.emit('downstream', {
                        channel: settings.channel + settings.updated.event,
                        change: {
                            value: 'serialize' in updated ? updated.serialize() : updated
                        }
                    });
                }
            }, null, 'downstream');
        }
        else if('delta' in settings)    // Array update
        {
            if(!'added' in settings.delta || !'removed' in settings.delta)
                throw new Error('Coupled array missing added or removed event names');

            // Upstream add (server->client)
            socket.on(settings.channel + settings.delta.added, function (val)
            {
                target.push_upstream(val);
            });

            // Upstream remove (server->client)
            socket.on(settings.channel + settings.delta.removed, function (val)
            {
                target.remove_upstream(function (v) { return v.id == val.id; });
            });

            target.subscribe(function (changes)
            {
                changes.forEach(function (change)
                {
                    var channel = settings.channel;

                    switch(change.status)
                    {
                        case 'added':
                            channel += settings.delta.added;
                            break;

                        case 'deleted':
                            channel += settings.delta.removed;
                            break;
                    }

                    socket.emit('downstream', {
                        channel: channel,
                        data: 'serialize' in change.value ? change.value.serialize() : change.value
                    });
                });
            }, null, 'downstream-arrayChange');
        }
        else
        {
            throw new Error('Coupled observables require update/delta events');
        }

        return target;
    };
});
