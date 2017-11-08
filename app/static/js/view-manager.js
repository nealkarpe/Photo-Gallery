var viewManager = (function () {
    var vm = {};
    var templateCache = {};
    var $root = $('#content');

    var renderTemplate = function (template, data, callback) {
        var compiledTemplate = Handlebars.compile(template);
        var renderedHtml = compiledTemplate(data);
        var $node = $(renderedHtml);
        $root.html( $node );
        if ($.isFunction(callback)) {
            callback($node);
        }
    };

    var render = function(view, data, callback) {

        if ($.isFunction(data)) {
            callback = data;
            data = {};
        }
        if (view in templateCache) {
            renderTemplate(templateCache[view], data, callback);
        }
        $.get({
            url:'/static/templates/' + view + '.html',
            success: function (response) {
                templateCache[view] = response;
                renderTemplate(response, data, callback);
            }
        });
    };

    vm.render = render;
    return vm;
})();
