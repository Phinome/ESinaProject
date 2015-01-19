var suzhan = window.suzhan || {};
suzhan.util = {
    rootpath: "/src",
    cleanxss: function (str) {
        return encodeURIComponent(decodeURIComponent(str).replace(/<[^>]+>/g, ''));
    },
    getLocationParams: function () {
        var itemid = location.search.match(/id=(\d+)/) ?
            suzhan.util.cleanxss(location.search.match(/id=(\d+)/)[1]) :
            "",
            itemtype = location.search.match(/type=(\w+)/) ?
            suzhan.util.cleanxss(location.search.match(/type=(\w+)/)[1]) :
            "";
        return {
            id: itemid,
            type: itemtype
        };
    },
    getUrlParams: function (key) {
        var reg = new RegExp("(^|&)"+ key +"=([^&]*)(&|$)"),
            temp = window.location.search.substr(1).match(reg);
        return temp && temp[2] ? decodeURIComponent(temp[2]) : null;
    },
    getData: function (cb) {
        var itemid = suzhan.util.getLocationParams().id,
            itemtype = suzhan.util.getLocationParams().type;
        if (itemid && itemtype) {
            $.getJSON('data.json', {
                id: itemid
            }, function (data) {
                cb(data);
            });
        } else {
            alert("itemid未获取!");
        }
    },
    setData: function (params, cb) {
        var itemid = suzhan.util.getLocationParams().id,
            itemtype = suzhan.util.getLocationParams().type;
        if (itemid && itemtype) {
            $.post('data.json', params, function (data) {
                cb(data);
                var refreshIframe = $(".widget[data-id=" + itemid + "]").find("iframe");
                refreshIframe.attr('src', refreshIframe.attr("src"));
            });
        }
    },
    tips: function (msg, hasclose) {
        if ($("#tips").length) {
            $("body").children().eq(0).before($("#tips"));
        } else {
            $("body").children().eq(0).before($('<div id="tips" class="tips"></div>'));
        }
        $("#tips").html(msg).slideDown(300);
        if (hasclose) {
            var close = $('<div class="closetips">x</div>');
            $("#tips").append(close);
        } else {
            setTimeout(function () {
                $("#tips").slideUp(300);
            }, 5000);
        }
        $("#tips").delegate(".closetips", "click", function () {
            $("#tips").slideUp(300);
        });
    },
    alert: function (msg, cb) {
        try{
            $("#alert").dialog("isOpen") ?
            $("#alert p").first().before("<p>" + msg + "</p>") :
            $("#alert").html("<p>" + msg + "</p>");
        }catch(e){
            console.log(e);
            $("#alert").html("<p>" + msg + "</p>");
        }
        $("#alert").dialog({
            resizable: false,
            modal: true,
            width: 400,
            buttons: {
                "确定": function () {
                    $(this).dialog("close");
                    if (cb instanceof Function) {
                        try {
                            cb();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        });
    },
    confirm: function (msg, cb) {
        $("#alert").html("<p>" + msg + "</p>");
        $("#alert").dialog({
            resizable: false,
            modal: true,
            width: 400,
            buttons: {
                "确定": function () {
                    $(this).dialog("close");
                    if (cb instanceof Function) {
                        try {
                            cb();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                },
                "取消": function () {
                    $(this).dialog("close");
                }
            }
        });
    },
    checkLogin: function (cb) {
        sinaSSOController.autoLogin(function (data) {
            if (data) {
                $("#login-form").hide();
                $("#auto-login-form").removeClass('hidden');
                location.href.match(/login.html/) ?
                    $("#user-avatar").html("<img src='http://tp2.sinaimg.cn/" + data.uid + "/180/1' class='avatar' /><p id='avatar-user-name'>" + data.nick + "</p>") :
                    $("#user-avatar").html("<img src='http://tp2.sinaimg.cn/" + data.uid + "/180/1' class='avatar' />" + data.nick + " <a href='javascript:void(0);' onclick='suzhan.util.admin.logout()'>[退出]</a>");
                if(cb instanceof Function){
                    try{cb();}catch(e){console.log(e);}
                }
                return data;
            } else {
                location.href.match(/login.html/) ? '' : location.href = suzhan.util.rootpath + '/login.html';
            }
        });
    },
    auth: function () {
        $.post("/advertiser/confirm", function () {
            setTimeout(function () {
                location.href = suzhan.util.rootpath +  "/pages/site.html";
            });
        });
    },
    ssologout: function () {
        sinaSSOController.logout();
    },
    login: function () {
        suzhan.io.post("/admanager/login", {})
            .done(function () {
                location.href = suzhan.util.rootpath + "/";
            });
    },
    logout: function () {
        suzhan.io.post("/admanager/logout", {})
            .done(function () {
                suzhan.util.logout();
            });
    },
    beforeunload: function (status) {
        if(status !== false){
            window.onbeforeunload = function (event) {
                try{
                    event.returnValue = "站点尚未发布, 确定要离开此制作页面么?";
                }catch(e){
                    console.log(e);
                }
            };
        }else{
            window.onbeforeunload = null;
        }
    },
    loading: function (s) {
        if (!this.loadcover) {
            var fragment = "<div id='loading' class='loading'><div class='battery'></div><p>loading...</p></div>";
            this.loadcover = $(fragment);
            $("body").append(this.loadcover);
        }
        $("#loading").css({
            width: $(window).width(),
            height: $(window).height()
        });
        if (s === false) {
            clearTimeout(suzhan.isloading);
            $("#loading").hide();
        } else {
            suzhan.isloading = setTimeout(function () {
                clearTimeout(suzhan.isloading);
                $("#loading").show();
            }, 200);
        }
    },
    table: function (fields, data) {
        var _generateHead = function () {
            var attr,
                className,
                row = '';
            for (var i = 0, il = fields.length; i < il; i++) {
                attr = fields[i].width ? ('style="width:' + fields[i].width + 'px"') : '';
                if (typeof fields[i].title === 'string') {
                    row += '<th ' + attr + ' class="text-center">' + fields[i].title + '</th>';
                } else if (typeof fields[i].title === 'function') {
                    row += fields[i].title();
                }
                if (fields[i]['class']) {
                    className = fields[i]['class'];
                }
            }
            className = className ? className : 'active';
            return '<tr class="' + className + '">' + row + '</tr>';
        };
        var _generateRow = function (data, fields, index) {
            var row = '',
                cell = '',
                attr = '',
                cls = '';
            for (var i = 0, il = fields.length; i < il; i++) {
                attr = fields[i].width ? ('style="width:' + fields[i].width + 'px"') : ''; 
                cls = fields[i].align ? ('class='+ fields[i].align) : '';
                if (typeof fields[i].content === 'string') {
                    row += '<td ' + attr + ' ' + cls + '>' + ((data[fields[i].content] === undefined || data[fields[i].content] === null) ? '' : data[fields[i].content]) + '</td>';
                } else if (typeof fields[i].content === 'function') {
                    cell = fields[i].content(data, index);
                    if (typeof cell === "undefined") {
                        cell = "";
                    }
                    if (!/^<td>(.*?)<\/td>$/.test(cell)) {
                        cell = '<td ' + attr + ' ' + cls + '>' + cell + '</td>';
                    }
                    row += cell;
                }
            }
            return '<tr>' + row + '</tr>';
        };
        var tableContent = '',
            tableHead = _generateHead(fields);

        for (var i = 0, il = data.length; i < il; i++) {
            tableContent += _generateRow(data[i], fields, i);
        }
        if (data.length === 0) {
            tableContent = '<tr><td colspan=' + fields.length + ' class="text-center">暂无数据</td></tr>';
        }
        return tableHead + tableContent;
    },
    pager :function (cur, total, clickFunc, pagerNo) {
        var pagerEl = $("#pager" + (pagerNo ? pagerNo : ""));
        var pagerHtml = [];
        var haspre = cur <= 1 ? 'class="disabled"' : '';
        var hasnext = cur >= total ? 'class="disabled"' : '';
        var ellipsis = 0;
        pagerHtml.push(
            '<ul class="pagination pagination-sm" id="pager">',
            '<li ' + haspre + '>',
            '<a href="javascript:void(0);">&laquo;</a>',
            '</li>'
        );
        for (var i = 1; i <= total; i++) {
            var selected = (i === cur) ? 'class="active"' : '';
            if(total > 34){
                if((i <= 10 || i > (total - 10))){
                    pagerHtml.push(
                        '<li ' + selected + '>',
                        '<a href="javascript:void(0);">' + i + '</a>',
                        '</li>'
                    );
                }else if(i === (cur - 1) || i === cur || i === (cur + 1)){
                    pagerHtml.push(
                        '<li ' + selected + '>',
                        '<a href="javascript:void(0);">' + i + '</a>',
                        '</li>'
                    );
                }else if(i === (cur - 2) || i === (cur + 2) || (i > cur && ellipsis < 1)){
                    ellipsis++;
                    pagerHtml.push(
                        '<li>',
                        '<a href="javascript:void(0);">...</a>',
                        '</li>'
                    );
                }
            }else{
                pagerHtml.push(
                    '<li ' + selected + '>',
                    '<a href="javascript:void(0);">' + i + '</a>',
                    '</li>'
                );
            }
        }
        pagerHtml.push(
            '<li ' + hasnext + '>',
            '<a href="javascript:void(0);">&raquo;</a>',
            '</li>',
            '</ul>'
        );
        pagerEl.html(pagerHtml.join(''));
        pagerEl.find("a").each(function (i, el) {
            $(el).click(function () {
                if (!$(el).hasClass("disabled") && !$(el).hasClass("active")) {
                    if (i !== 0 && i !== pagerEl.find("a").length - 1) {
                        if (typeof clickFunc === "function") {
                            if($(this).text() !== "..."){
                                clickFunc(parseInt($(this).text(), 10));
                            }
                        } else {
                            alert($(this).text());
                        }
                    } else if (i === 0) {
                        if (typeof clickFunc === "function") {
                            clickFunc(cur - 1);
                        } else {
                            alert(cur - 1);
                        }
                    } else {
                        if (typeof clickFunc === "function") {
                            clickFunc(cur + 1);
                        } else {
                            alert(cur + 1);
                        }
                    }
                }
            });
        });
        return (cur + "/" + total);
    },
    _defaults: {
        dayNamesShort: "",
        dayNames: "",
        monthNamesShort: "",
        monthNames: ""
    },
    tab: function (tabEl, contentEl) {
        $(tabEl).children().eq(0).addClass("selected");
        $(contentEl).children().eq(0).addClass("selected");
        $(tabEl).delegate(">", "click", function (event) {
            var selectIndex = $(event.target).index();
            $(tabEl).children().removeClass("selected");
            $(tabEl).children().eq(selectIndex).addClass("selected");
            $(contentEl).children().removeClass("selected");
            $(contentEl).children().eq(selectIndex).addClass("selected");
        });
        $(contentEl).delegate();
    },
    formatDate: function (format, date, settings) {
        if (!date) {
            return "";
        }else if(typeof date !== "object"){
            date = new Date(date);
        }

        var iFormat,
            dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
            dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
            monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
            monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
            // Check whether a format character is doubled
            lookAhead = function(match) {
                var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if (matches) {
                    iFormat++;
                }
                return matches;
            },
            // Format a number, with leading zero if necessary
            formatNumber = function(match, value, len) {
                var num = "" + value;
                if (lookAhead(match)) {
                    while (num.length < len) {
                        num = "0" + num;
                    }
                }
                return num;
            },
            // Format a name, short or long as requested
            formatName = function(match, value, shortNames, longNames) {
                return (lookAhead(match) ? longNames[value] : shortNames[value]);
            },
            output = "",
            literal = false;

        if (date) {
            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        output += format.charAt(iFormat);
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            output += formatNumber("d", date.getDate(), 2);
                            break;
                        case "D":
                            output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                            break;
                        case "o":
                            output += formatNumber("o",
                                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                            break;
                        case "m":
                            output += formatNumber("m", date.getMonth() + 1, 2);
                            break;
                        case "M":
                            output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                            break;
                        case "y":
                            output += (lookAhead("y") ? date.getFullYear() :
                                (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                            break;
                        case "@":
                            output += date.getTime();
                            break;
                        case "!":
                            output += date.getTime() * 10000 + this._ticksTo1970;
                            break;
                        case "'":
                            if (lookAhead("'")) {
                                output += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            output += format.charAt(iFormat);
                    }
                }
            }
        }
        return output;
    }
};

var sinaSSOController = window.sinaSSOController || {};
sinaSSOController.customLoginCallBack = function (data) {
    if (typeof data !== "object") {
        data = JSON.parse(data);
    }
    if (data.retcode === 0) {
        suzhan.util.login();
    } else {
        suzhan.util.alert(data.reason);
    }
};
sinaSSOController.customLogoutCallBack = function () {
    suzhan.util.checkLogin();
};