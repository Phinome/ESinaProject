define(["jquery", "react"], function ($, React) {
    "use strict";

    var UINav = React.createClass({displayName: "UINav",
        componentDidMount: function() {
            this.props.items.on('add', $.proxy(function() {
                this.forceUpdate();
            }, this));
            this.props.items.on('remove', $.proxy(function() {
                this.forceUpdate();
            }, this));
        },
        render: function () {
            var items = this.props.items.map($.proxy(function (item, i) {
                return (
                    React.createElement("li", {key: i}, 
                        item.get('name'), 
                        React.createElement("span", {className: "remove-btn", onClick: $.proxy(this.props.onremove, this, item.cid)}, "x")
                    ) 
                );  
            }, this));
            return (
                React.createElement("div", null, 
                    React.createElement("span", {onClick: this.props.onadd}, "add"), 
                    React.createElement("ul", null, 
                        items
                    )
                )
            );
        }
    });

    return UINav;
});