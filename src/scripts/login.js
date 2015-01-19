/**
 * Created by phinome on 1/16/15.
 */
requirejs.config({
    baseUrl: "./",
    paths: {
        jquery: "lib/jquery/dist/jquery",
        jqueryui: "lib/jqueryui/jquery-ui.min"
    },
    shim: {
        jquery: {
            exports: "$"
        },
        jqueryui: {
            deps: ['jquery']
        }
    }
});

require([
    'jquery',
    'jqueryui'
], function ($) {
    /**
     *
     * @param dom
     */
    function failValidate(dom) {
        dom.parent('.form-group').addClass('has-error has-feedback');
        dom.after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
    }

    function successValidate(dom) {
        dom.parent('.form-group').removeClass('has-error has-feedback');
        dom.next().remove();
    }

    /**
     *
     * @param dom
     *
     */
    function sampleValidate(dom) {
        if (!dom.val()) {
            failValidate(dom);
            return false;
        }
    }

    $(document).ready(function () {
        var username = $('#username');
        var password = $('#password');
        var flag = false;
        // sso login check
        suzhan.util.checkLogin();

        // weibo login
        $("#weibo-login").on("click", function () {
            suzhan.util.login();
        });

        // change user click event
        $("#change-user").on("click", function (e) {
            e.preventDefault();
            $("#auto-login-form").hide();
            $("#login-form").fadeIn();
        });

        username.on('input propertychange', function (e) {
            if ($(e.target).val()) {
                successValidate($(this));
            }
        });

        password.on('input propertychange', function (e) {
            if ($(e.target).val()) {
                successValidate($(this));
            }
        });

        // validate form & login
        $("#login-form").on("submit", function (e) {
            e.preventDefault();
            var url = "/admanager/login";

            // TODO: 考虑校验的改进
            if (!username.val() && !flag) {
                flag = true;
                sampleValidate(username);
            }

            if (!password.val() && !flag) {
                flag = true;
                sampleValidate(password);
            }

            $.post(url, $("#login-form").serialize()).done(function (data) {
                window.location.href = './';
            }).fail(function (data) {
                $("#alert").html(data.info);
                $("#alert").dialog({
                    resizable: false,
                    modal: true,
                    width: 400,
                    buttons: {
                        "确定": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        });

    });

});