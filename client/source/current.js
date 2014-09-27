define(['knockout'], function (ko)
{
    function isObservableArray(o)
    {
        return ko.isObservable(o) && o.indexOf !== undefined;
    }

    ko.extenders.current = function (target, default)
    {
        default = default || 'downstream';

        if(default != 'downstream' && default != 'upstream')
            throw new Error('Current must be either upstream or downstream by default');

        target.upstream = function (value)
        {
            target(value);

            if(default !== 'upstream')
                target.notifySubscribers(value, 'upstream');
        };

        target.downstream = function (value)
        {
            target(value);

            if(default !== 'downstream')
                target.notifySubscribers(value, 'downstream');
        };

        target.subscribe(function (value)
        {
            target.notifySubscribers(value, default);
        });

        if(isObservableArray(target))
        {
            // TODO make this work with arrays
            
            target.subscribe(function (changes)
            {
                target.notifySubscribers(changes, default + '-arrayChange');
            }, null, 'arrayChange');

            target.push_upstream = function (val)
            {

            };

            target.remove_upstream = function (pred)
            {

            };

            target.push_downstream = function (val)
            {

            };

            target.push_upstream = function (pred)
            {

            };
        }

        return target;
    };
});
