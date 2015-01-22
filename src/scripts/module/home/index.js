define([
    "backbone",
    "react",
    "scripts/view/home/index",
    "css!styles/home"
], function (Backbone, React, HomeView) {
    App.Models.Home = Backbone.Model.extend({

    });

    App.Collections.Home = Backbone.Collection.extend({
        model: App.Models.Home
    });

    App.Views.Home = Backbone.View.extend({
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
            React.render(<HomeView/>, this.el);
        }
    })

    return function (params) {
        suzhan.util.checkLogin();

        //模拟数据
        //var hc = new App.Collections.Home();
        //hc.add([
        //    {'name': 'home', 'link': '#home/index/a:moduleA/other:nothing'},
        //    {'name': 'sites', 'link': '#sites/index'}
        //]);
        new App.Views.Home();
    }
});