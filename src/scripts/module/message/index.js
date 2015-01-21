/**
 * Created by phinome on 1/20/15.
 */
define([
    "backbone",
    "react",
    "scripts/view/message/index",
    "css!styles/message"
], function (Backbone, React, MessageView) {
    "use strict";
    App.Models.Message = Backbone.Model.extend({

    });

    App.Collections.Message = Backbone.Collection.extend({
        model: App.Models.Message
    });

    App.Views.Message = Backbone.View.extend({
        el: '#Main',
        initialize: function(c) {
            this.Collections = c;
            this.render();
        },
        render: function() {
            //var html = '';
            //this.Collections.each(function(m) {
            //    html += '<div><a href="' + m.get('link') + '">' + m.get('name') + '</a></div>';
            //});
            //this.$el.html(html);
            React.render(<MessageView/>, this.el);
        }
    })

    return function (params) {
        //模拟数据
        //var hc = new App.Collections.Home();
        //hc.add([
        //    {'name': 'home', 'link': '#home/index/a:moduleA/other:nothing'},
        //    {'name': 'sites', 'link': '#sites/index'}
        //]);
        new App.Views.Message();
    }
});