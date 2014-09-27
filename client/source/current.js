define(['knockout'], function (ko)
{
    function isObservableArray(o)
    {
        return ko.isObservable(o) && o.indexOf !== undefined;
    }

    ko.extenders.current = function (target, default)
    {
        default = default || 'downstream';

        var currentObservable = ko.computed({
            read: function ()
            {
                return target().value;
            },
            write: function (val)
            {
                target({
                    direction: default,
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
