define(['knockout', 'currentArray'], function (ko)
{
    function isObservableArray(o)
    {
        return ko.isObservable(o) && o.indexOf !== undefined;
    }

    ko.extenders.current = function (target, defaultDirection)
    {
        defaultDirection = defaultDirection || 'downstream';

        if(isObservableArray(target))
            return target.extend({ currentArray: defaultDirection });

        target({
            value: target(),
            direction: defaultDirection
        });

        var currentObservable = ko.computed({
            read: function ()
            {
                return target().value;
            },
            write: function (val)
            {
                target({
                    direction: defaultDirection,
                    value: val
                });
            }
        });

        currentObservable.upstream = function (val)
        {
            target({
                direction: 'upstream',
                value: val
            });
        };

        currentObservable.downstream = function (val)
        {
            target({
                direction: 'downstream',
                value: val
            });
        };

        target.subscribe(function (val)
        {
            currentObservable.notifySubscribers(val.value, val.direction);
        });

        return currentObservable;
    };
});
