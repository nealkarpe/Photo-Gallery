var authManager = (function() {
    var loginState = null;
    var intendedPath = null;

    var loggedIn = function (user) {
        loginState = {};
        loginState.loggedIn = true;
        loginState.user = user;
        page(intendedPath ? intendedPath : '/');
    };

    var showLogin = function() {
        viewManager.render('login', function ($view) {
            $view
                .find('form')
                .submitViaAjax(function (response) {
                    if (response.success) {
                        loggedIn(response.user);
                    } else {
                        $view.find('.message').text(response.message);
                    }
                });
        });
    };

    var logout = function () {
        $.post({
            url: '/api/logout',
            success: function (response) {
                loginState = null;
                page("/");
            },
        });
    }

    var showRegister = function () {
        viewManager.render('register', function ($view) {
            $view
                .find('form')
                .submitViaAjax(function (registerResponse) {
                    var form = this;
                    if (registerResponse.success) {
                        $.post({
                            url: '/api/login',
                            data: {
                                username: form.username.value,
                                password: form.password.value,
                            },
                            success: function(response) {
                                if (response.success) {
                                    loggedIn(response.user);
                                } else {
                                    path('/login');
                                }
                            },
                        })
                    } else {
                        $view.find('.message').text(registerResponse.message);
                    }
                });
        });
    };

    var getLoginState = function (cb) {
        if (loginState === null) {
            $.get({
                url: '/api/login',
                success: function (response) {
                    loginState = {};
                    if (response.success) {
                        loginState.loggedIn = true;
                        loginState.user = response.user;
                    } else {
                        loginState.loggedIn = false;
                    }
                    cb(loginState);
                },
                error: function (response) {
                    cb(loginState);
                }
            });
        } else {
            cb(loginState);
        }
    };

    var requiresAuthentication = function(ctx, next) {
        getLoginState(function (state) {
            console.log(state);
            if (state && state.loggedIn) {
                next();
            } else {
                intendedPath = ctx.path;
                //showLogin();
                page('/login');
            }
        });
    };

    var allowOnlyGuest = function (ctx, next) {
        getLoginState(function (state) {
            if (state.loggedIn) {
                page('/');
            } else {
                next();
            }
        });
    };

    var aManager = {};
    aManager.showLogin = showLogin;
    aManager.logout = logout;
    aManager.showRegister = showRegister;
    aManager.allowOnlyGuest = allowOnlyGuest;
    aManager.requiresAuthentication = requiresAuthentication;
    return aManager;
})();
