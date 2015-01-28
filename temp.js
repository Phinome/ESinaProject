sax.report.model = new er.Model({
    LOADER_LIST: ["getReportList"],
    /**
    列表请求发送参数
    */
    QUERY_MAP: {
        "page.pageSize": "pageSize",
        "page.pageNo": "pageNo",
        "startDate": "startDate",
        "endDate": "endDate",
        "type": "reportType",
        "page.orderBy": "orderBy",
        "page.order": "order"
    },
    getReportList: new er.Model.Loader(function() {
        var me = this;
        var TABLE_FIELDS = [{
                title: '日期',
                content: function(item) {
                    return sax.util.dateForShow(item["statDate"])
                },
                width: '80',
                align: 'center',
                sortable: true,
                field: 'statDate'
            }, {
                title: '请求次数',
                content: function(item) {
                    return T.number.comma(item['requestTimes']);
                },
                align: 'center',
                sortable: true,
                field: 'requestTimes'
            },
            // {
            //     title: '竞价次数',
            //     content: function(item) {
            //         return T.number.comma(item['bidTimes']);
            //     },
            //     align: 'center',
            //     sortable: true,
            //     field: 'bidTimes'
            // },
            {
                title: '展示次数',
                content: function(item) {
                    return T.number.comma(item['settleImp']);
                },
                align: 'center',
                sortable: true,
                field: 'settleImp'
            },
            // {
            //     title: '竞标率',
            //     content: function(item) {
            //         return sax.util.percent(item["gainRate"]);
            //     },
            //     align: 'center',
            //     sortable: true,
            //     field: 'gainRate'
            // },
            {
                title: '点击',
                content: function(item) {
                    return T.number.comma(item['click']);
                },
                align: 'center',
                sortable: true,
                field: 'click'
            }, {
                title: '点击率',
                content: function(item) {
                    return sax.util.perthousand(item["ctr"]);
                },
                align: 'center',
                sortable: true,
                field: 'ctr'
            }, {
                title: '平均CPM',
                content: function(item) {
                    return T.number.comma(sax.util.num2(item["cpm"]));
                },
                align: 'center',
                sortable: true,
                field: 'cpm'
            }, {
                title: '消耗',
                content: function(item) {
                    return T.number.comma(sax.util.num2(item["settlePrice"]));
                },
                align: 'center',
                sortable: true,
                field: 'settlePrice'
            }
        ];
        if (me.get("startDate") && me.get("endDate")) {

        } else {
            var today = T.date.format(new Date(), "yyyyMMdd");
            var lastMonth = T.date.format(new Date(new Date() - 30 * 24 * 60 * 60 * 1000), "yyyyMMdd");

            me.set("startDate", lastMonth);
            me.set("endDate", today);
        }
        me.set("pageSize", sax.util.getPageSize(30));
        me.stop();
        var params = me.getQueryString();
        sax.report.dao.getReportList(params, function(data) {
            me.set("tablefields", TABLE_FIELDS);
            data.pageFoot.statDate = "合计";
            if (data.page.totalCount) {
                data.page.result.push(data.pageFoot);
            }
            me.set("tabledata", data.page.result);
            me.set("totalCount", data.page.totalCount);
            me.set("pageNo", data.page.pageNo);
            me.start();
        });
    })
});
sax.report = new er.Action({
    model: sax.report.model,
    STATE_MAP: {
        "reportType": -1
    },
    view: new er.View({
        template: 'reportTpl',
        UI_PROP: {
            "ListPager": {
                "maxnum": "*totalCount",
                "pagesize": "*pageSize"
            },
            'dataTable': {
                'fields': '*tablefields',
                'datasource': '*tabledata',
                orderby: '*orderby',
                order: '*order'
            }
        }
    }),
    /**
    分页点击事件
    */
    _getPageChangeHandler: function() {
        var me = this;
        return function(v) {
            me.model.set('pageNo', v);
            me.refresh();
        }
    },
    _filterReportByDate: function() {
        var me = this;
        return function(v) {
            var start = sax.util.formatDate(v[0]);
            var end = sax.util.formatDate(v[1]);
            me.model.set("startDate", start.split("-").join(""));
            me.model.set("endDate", end.split("-").join(""));
        }
    },
    _downloadReportByDate: function() {
        var me = this;
        return function() {
            var params = me.model.getQueryString();
            params += "&download=true";
            location.href = sax.CONFIG.CLIENTROOT + '/report/dspReport!dspDayReport.action?' + params;
        }
    },
    _initSelectDate: function() {
        var start = this.model.get("startDate"),
            end = this.model.get("endDate"),
            formatStart = start.substring(0, 4) + "-" + start.substring(4, 6) + "-" + start.substring(6, 8),
            formatEnd = end.substring(0, 4) + "-" + end.substring(4, 6) + "-" + end.substring(6, 8);
        ecui.get("SelectDate").setDate({
            begin: baidu.date.parse(formatStart),
            end: baidu.date.parse(formatEnd)
        });
    },
    /**
    排序事件
    */
    _getSortTableHandler: function() {
        var me = this;
        return function(orderby, order) {
            me.model.set('orderby', orderby);
            me.model.set('order', order);
            ecui.get("ListPager").clearPage();
        };
    },
    _typeChangeHandler: function() {
        var me = this;

        me.model.set("reportType", ecui.get("reportType").getValue());
    },
    _searchHandler: function() {
        var me = this;

        return function()  {
            if(!me.model.get("startDate")) {
                ecui.alert("请选择日期！");
                return
            }
            me.model.set("reportType", ecui.get("reportType").getValue());
            ecui.get("ListPager").clearPage();
        };
    },
    onafterrender: function() {
        ecui.get('dataTable').onsort = this._getSortTableHandler();
        ecui.get("ListPager").onchange = this._getPageChangeHandler();
        ecui.get("SelectDate").onchange = this._filterReportByDate();
        ecui.get("downloadReport").onclick = this._downloadReportByDate();
        ecui.get("searchBtn").onclick = this._searchHandler();
        ecui.get("reportType").onchange = this._typeChangeHandler();
        this._initSelectDate();
    }
});
