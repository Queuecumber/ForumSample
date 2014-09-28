define(['knockout'], function (ko)
{
    ko.extenders.currentArray = function (target, defaultDirection)
    {
        defaultDirection = defaultDirection || 'downstream';

        target(target().map(function (c)
        {
            return {
                value: c,
                direction: defaultDirection
            };
        }));

        var currentObservable = ko.computed({
            read: function ()
            {
                return target().map(function (c)
                {
                    return c.value;
                });
            },
            write: function (val)
            {
                target(val.map(function (v)
                {
                    return {
                        value: v,
                        direction: defaultDirection
                    };
                }));
            }
        });

        currentObservable.upstream = function (val)
        {
            target(val.map(function (v)
            {
                return {
                    value: v,
                    direction: 'upstream'
                };
            }));
        };

        currentObservable.downstream = function (val)
        {
            target(val.map(function (v)
            {
                return {
                    value: v,
                    direction: 'upstream'
                };
            }));
        };

        target.subscribe(function (val)
        {
            var up = target().filter(function (v) { return v.direction == 'upstream'; }).map(function (v) { return v.value; });
            var down = target().filter(function (v) { return v.direction == 'downstream'; }).map(function (v) { return v.value; });

            if(up.length)
                currentObservable.notifySubscribers(up, 'upstream');

            if(down.length)
                currentObservable.notifySubscribers(down, 'downstream');
        });

        target.subscribe(function (changes)
        {
            var up = changes.filter(function (c) { return c.value.direction == 'upstream'}).map(function (c) { c.value = c.value.value; return c; });
            var down = changes.filter(function (c) { return c.value.direction == 'downstream'}).map(function (c) { c.value = c.value.value; return c; });

            if(up.length)
                currentObservable.notifySubscribers(up, 'upstream-arrayChange');

            if(down.length)
                currentObservable.notifySubscribers(down, 'downstream-arrayChange');

            var bidirectional = changes;

            currentObservable.notifySubscribers(bidirectional, 'arrayChange');

        }, null, 'arrayChange');


        currentObservable.push_upstream = function (val)
        {
            return target.push({
                value: val,
                direction: 'upstream'
            });
        };

        currentObservable.push_downstream = function (val)
        {
            return target.push({
                value: val,
                direction: 'downstream'
            });
        };

        currentObservable.push = function (val)
        {
            return target.push({
                value: val,
                direction: defaultDirection
            });
        };

        currentObservable.remove_upstream = function (pred)
        {
            return target.remove(function (v)
            {
                if(pred(v.value))
                {
                    v.direction = 'upstream';
                    return true;
                }

                return false;
            });
        };

        currentObservable.remove_downstream = function (pred)
        {
            return target.remove(function (v)
            {
                if(pred(v.value))
                {
                    v.direction = 'downstream';
                    return true;
                }

                return false;
            });
        };

        currentObservable.remove = function (pred)
        {
            return target.remove(function (v)
            {
                if(pred(v.value))
                {
                    v.direction = defaultDirection;
                    return true;
                }

                return false;
            });
        };

        return currentObservable;
    };
});
