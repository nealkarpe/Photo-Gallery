$.fn.submitViaAjax = function (success, error) {
    this.on('submit', function (e) {
        
	var form = this;
	var form_data = new FormData(form);

	$.ajax({
        url: form.action,
        type: form.method,
        data: form_data,
        async: false,
	success: success ? success.bind(form) : function () {},
        error: error? error.bind(form) : function () {},
        /*success: function (data) {
            alert(data)
        },*/
        cache: false,
        contentType: false,
        processData: false
    });
        return false;
    });
    return this;
};


/*$.fn.submitViaAjax2 = function (success, error) {
    this.on('submit', function (e) {
        e.preventDefault();
        var form = this;
        var form_data = new FormData(form);
        $.ajax({
            method: form.method,
            url: form.action,
            data: form_data;
            contentType: false,
            processData: false,
            async: false,
            cache: false,
            success: alert("yuss!"),
            error: alert("noo!",
        });
        return false;
    });
    return this;
};
*/


/*
$.fn.submitViaAjax = function (success, error) {
    this.on('submit', function (e) {
        e.preventDefault();
        var form = this;
        $.ajax({
            method: form.method,
            url: form.action,
            data: $(form).serialize(),
            success: success ? success.bind(form) : function () {},
            error: error? error.bind(form) : function () {},
        });
        return false;
    });
    return this;
};
*/

