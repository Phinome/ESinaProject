/**
 * Created by phinome on 1/22/15.
 */
define([
    "backbone",
    "react",
    "scripts/view/home/audit",
    "css!styles/audit"
], function (Backbone, React, AuditView) {
    App.Models.Audit = Backbone.Model.extend({

    });

    App.Collections.Audit = Backbone.Collection.extend({
        model: App.Models.Audit
    });

    App.Views.Audit = Backbone.View.extend({
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
            React.render(<AuditView model={this.Collections}/>, this.el);
        }
    })

    return function (params) {
        suzhan.util.checkLogin();
        console.log(params);
        //模拟数据
        //var hc = new App.Collections.Home();
        //hc.add([
        //    {'name': 'home', 'link': '#home/index/a:moduleA/other:nothing'},
        //    {'name': 'sites', 'link': '#sites/index'}
        //]);
        new App.Views.Audit(params);
    }
});