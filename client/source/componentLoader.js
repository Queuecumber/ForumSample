define(['knockout', 'text!components.json'], function (ko, components)
{
    var componentDefinitions = JSON.parse(components);

    componentDefinitions.forEach(function (c)
    {
        ko.components.register(c.name, {
            viewModel: { require: c.viewModel },
            template: { require: 'text!' + c.view }
        });
    });
});
