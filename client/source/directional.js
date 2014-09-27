define(['knockout'], function (ko)
{
    ko.extenders.directional = function (target, default)
    {
        default = default || 'downstream';

        if(default != 'downstream' && default != 'upstream')
            throw new Error('Directional changes must be either upstream or downstream by default');

        target.upstream = function (value)
        {
            target.notifySubscribers(value, 'upstream');
            target.notifySubscribers(value);
        };

        target.downstream = function (value)
        {
            target.notifySubscribers(value, 'downstream');
            target.notifySubscribers(value);
        };

        target.subscribe(function (value)
        {
            target.notifySubscribers(value, default);
        });

        return target;
    };
});
