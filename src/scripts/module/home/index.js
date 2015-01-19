define(["backbone", "react", "react-bootstrap"], function (Backbone, React, ReactUI) {
    "use strict";

    var Button = ReactUI.Button,
        Alert = ReactUI.Alert,
        Input = ReactUI.Input,
        MenuItem = ReactUI.MenuItem,
        Glyphicon = ReactUI.Glyphicon,
        DropdownButton = ReactUI.DropdownButton,
        ButtonToolbar = ReactUI.ButtonToolbar,
        OverlayTrigger = ReactUI.OverlayTrigger,
        Tooltip = ReactUI.Tooltip,
        TabbedArea = ReactUI.TabbedArea,
        TabPane = ReactUI.TabPane,
        Modal = ReactUI.Modal,
        ModalTrigger = ReactUI.ModalTrigger,
        ProgressBar = ReactUI.ProgressBar;

    var MyModal = React.createClass({displayName: "MyModal",
        render: function() {
            return (
                React.createElement(Modal, React.__spread({},  this.props, {title: "Modal heading", animation: false}), 
                  React.createElement("div", {className: "modal-body"}, 
                    React.createElement("h4", null, "Text in a modal"), 
                    React.createElement("p", null, "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."), 

                    React.createElement("h4", null, "Popover in a modal"), 
                    React.createElement("p", null, "TODO"), 

                    React.createElement("h4", null, "Tooltips in a modal"), 
                    React.createElement("p", null, "TODO"), 

                    React.createElement("hr", null), 

                    React.createElement("h4", null, "Overflowing text to show scroll behavior"), 
                    React.createElement("p", null, "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros."), 
                    React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), 
                    React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), 
                    React.createElement("p", null, "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros."), 
                    React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), 
                    React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), 
                    React.createElement("p", null, "Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros."), 
                    React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), 
                    React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.")
                  ), 
                  React.createElement("div", {className: "modal-footer"}, 
                    React.createElement(Button, {onClick: this.props.onRequestHide}, "Close")
                  )
                )
            );
        }
    });


    App.Models.Home = Backbone.Model.extend({});

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
            React.render(
                React.createElement("div", null, 
                    React.createElement(Button, {bsStyle: "primary"}, "Default button"), 
                    React.createElement(Button, null, "Default button"), 
                    React.createElement(Alert, {bsStyle: "warning"}, 
                      React.createElement("strong", null, "Holy guacamole!"), " Best check yo self, you're not looking too good."
                    ), 
                    React.createElement("form", null, 
                        React.createElement(Input, {type: "text", addonBefore: "@"}), 
                        React.createElement(Input, {type: "text", addonAfter: ".00"}), 
                        React.createElement(Input, {type: "text", addonBefore: "$", addonAfter: ".00"}), 
                        React.createElement(Input, {type: "text", addonAfter: React.createElement(Glyphicon, {glyph: "music"})}), 
                        React.createElement(Input, {type: "text", buttonBefore: React.createElement(Button, null, "Before")}), 
                        React.createElement(Input, {type: "text", buttonAfter: React.createElement(DropdownButton, {title: "Action"}, 
                            React.createElement(MenuItem, {key: "1"}, "Item")
                        )})
                    ), 

                    React.createElement(ButtonToolbar, null, 
                        React.createElement(OverlayTrigger, {placement: "left", overlay: React.createElement(Tooltip, null, React.createElement("strong", null, "Holy guacamole!"), " Check this info.")}, 
                            React.createElement(Button, {bsStyle: "default"}, "Holy guacamole!")
                        ), 
                        React.createElement(OverlayTrigger, {placement: "top", overlay: React.createElement(Tooltip, null, React.createElement("strong", null, "Holy guacamole!"), " Check this info.")}, 
                            React.createElement(Button, {bsStyle: "default"}, "Holy guacamole!")
                        ), 
                        React.createElement(OverlayTrigger, {placement: "bottom", overlay: React.createElement(Tooltip, null, React.createElement("strong", null, "Holy guacamole!"), " Check this info.")}, 
                            React.createElement(Button, {bsStyle: "default"}, "Holy guacamole!")
                        ), 
                        React.createElement(OverlayTrigger, {placement: "right", overlay: React.createElement(Tooltip, null, React.createElement("strong", null, "Holy guacamole!"), " Check this info.")}, 
                            React.createElement(Button, {bsStyle: "default"}, "Holy guacamole!")
                        )
                    ), 

                    React.createElement(TabbedArea, {defaultActiveKey: 2}, 
                        React.createElement(TabPane, {eventKey: 1, tab: "Tab 1"}, "TabPane 1 content"), 
                        React.createElement(TabPane, {eventKey: 2, tab: "Tab 2"}, "TabPane 2 content")
                    ), 

                    React.createElement(ModalTrigger, {modal: React.createElement(MyModal, null)}, 
                        React.createElement(Button, {bsStyle: "primary", bsSize: "large"}, "Launch demo modal")
                    ), 

                    React.createElement(ProgressBar, {bsStyle: "success", now: 40}), 
                    React.createElement(ProgressBar, {bsStyle: "info", now: 20}), 
                    React.createElement(ProgressBar, {bsStyle: "warning", now: 60}), 
                    React.createElement(ProgressBar, {bsStyle: "danger", now: 80})
                ),
                this.el
            );
        }
    })

    return function (params) {
        console.log(params);
        //模拟数据
        var hc = new App.Collections.Home();
        hc.add([
            {'name': 'home', 'link': '#home/index/a:moduleA/other:nothing'},
            {'name': 'group', 'link': '#group/index'}
        ]);
        new App.Views.Home(hc);
    }
});