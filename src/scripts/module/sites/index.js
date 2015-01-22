define([
    "backbone",
    "react",
    "scripts/view/sites/index",
    "css!styles/sites"
], function (Backbone, React, SitesView) {

    App.Models.Site = Backbone.Model.extend({});

    App.Collections.Site = Backbone.Collection.extend({
        model: App.Models.Site
    });


    App.Views.Site = Backbone.View.extend({
        el: '#Main',
        initialize: function (items) {
        this.items = items;
        this.render();
    },

    render: function() {
        React.render(<SitesView/>, this.el);
}
})

return function (params) {
    suzhan.util.checkLogin();

    //模拟数据
    //var items = new App.Collections.Items([
    //    {
    //        name: 'add'
    //        //link: 'http://baidu.com',
    //        //blank: true
    //    }
    //]);
    new App.Views.Site();
}
});