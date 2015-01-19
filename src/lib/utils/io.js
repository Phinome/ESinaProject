var suzhan = window.suzhan || {};
suzhan.io = (function (define) {
    suzhan.util = suzhan.util || {};
    suzhan.util.alert = suzhan.util.alert || function (msg) {
        window.alert(msg); 
    };//我的环境里面找不到util.alert
    var io = {
        loading: function () {},
        get: function(url, params) {
            //suzhan.util.loading();
            var This = this,
                df = new $.Deferred();
            $.ajax({
                url: url,
                type: "GET",
                data: params,
                dataType: "JSON"
            })
            .always(function () {
                //suzhan.util.loading(false);
            })
            .then(function (data) {
                This.getProcessHandler(data, df);
            },function () {
                suzhan.util.alert("网络错误");
                df.reject("网络错误");
            });
            return df;
        },
        post: function(url, params) {
            //suzhan.util.loading();
            var This = this,
                df = new $.Deferred();
            $.ajax({
                url: url,
                type: "POST",
                data: params,
                dataType: "JSON"
            })
            .always(function () {
                //suzhan.util.loading(false);
            })
            .then(function (data) {
                This.getProcessHandler(data, df);
            },function () {
                suzhan.util.alert("网络错误");
                df.reject("网络错误");
            });
            return df;
        },
        getProcessHandler: function(data, df) {
            switch (data.status) {
                case 0:
                    df.resolve(data.data);
                    break;
                case 1:
                    df.reject(data.data.tips || data.info);
                    suzhan.util.alert(data.data.tips || data.info);
                    break;
                case 127:
                case 128:
                    //df.reject(data.data);
                    setTimeout(function () {
                        top.location.href = suzhan.util.rootpath + "/pages/auth.html";
                    }, 100);
                    break;
                default:
                    suzhan.util.alert(data.data.tips || data.info);
                    df.reject(data.data.tips || data.info);
                    break;
            }
        },
        widgetLogin: function () {
            sinaSSOController.autoLogin(function (data) {
                if (data) {
                    suzhan.io.widgetLoginPanel({
                        id: data.uid,
                        name: data.nick
                    });
                } else {
                    suzhan.io.widgetLoginPanel();
                }
            });
        },
        widgetLogout: function () {
            sinaSSOController.logout();
            sinaSSOController.customLogoutCallBack = function () {
                window.location.href = window.location.href;
            };
        },
        widgetLoginPanel: function (option) {
            if(suzhan.io.loginpanel){
                suzhan.io.loginpanel.show();
            }else{
                var fragment = [];
                fragment.push(
                    '<div class="loginpanel">',
                        '<div class="loginbg"></div>',
                        '<div class="login">',
                            '<h2>用户登录</h2>',
                            '<div class="loginline"><input id="suzhan_username" type="text" placeholder="用户名" /></div>',
                            '<div class="loginline"><input id="suzhan_password" type="password" placeholder="密码" /></div>',
                            '<div class="loginline"><input type="button" id="suzhan_loginbtn" value="登录" /></div>',
                        '</div>',
                        '<div class="logined">',
                            '<div class="userimg" id="userimglabel"></div>',
                            '<div class="username" id="usernamelabel"><a href="javascript:void(0);" onclick="suzhan.io.widgetLogin()">[登录]</a></div>',
                        '</div>',
                    '</div>'
                );
                suzhan.io.loginpanel = $(fragment.join(''));
                $("body").append(suzhan.io.loginpanel);
                $("#suzhan_loginbtn").click(function () {
                    event.preventDefault();
                    if($("#suzhan_username").val() && $("#suzhan_password").val()){
                        sinaSSOController.login($("#suzhan_username").val(), $("#suzhan_password").val());
                    }else{
                        alert("请填写用户名,密码!");
                    }
                });
                sinaSSOController.customLoginCallBack = function (data) {
                    if (typeof data !== "object") {
                        data = JSON.parse(data);
                    }
                    if (data.retcode === 0) {
                        suzhan.io.widgetLogin();
                    } else {
                        suzhan.util.alert(data.reason);
                    }
                };
            }
            if(option instanceof Object){
                suzhan.io.loginpanel.find(".login").hide();
                suzhan.io.loginpanel.find(".loginbg").hide();
                suzhan.io.loginpanel.find(".logined").show();
                suzhan.io.loginpanel.find("#userimglabel").html("<img src='http://tp2.sinaimg.cn/" + option.id + "/180/1' />");
                suzhan.io.loginpanel.find("#usernamelabel").html(option.name + '<a href="javascript:void(0);" onclick="suzhan.io.widgetLogout()">[退出]</a>');
            }else{
                suzhan.io.loginpanel.find(".login").show();
                suzhan.io.loginpanel.find(".loginbg").show();
                suzhan.io.loginpanel.find(".logined").hide();
            }
        }
    };

    if (typeof define === "function" && define.amd) {
        define(function() {
            return io;
        });
    } else {
        return io;
    }

})(window.define);
