/**
 * Created by phinome on 1/22/15.
 *
 * Audit React View
 */

define([
    "jquery",
    "react",
    "react-bootstrap",
    "css!styles/audit"
], function($, React, ReactUI) {
    "use strict";

    var config = {
        dataSource : '/admanager/client/client',
        auditSource : '/admanager/client/review'
    };
    var fields = [{
        title: "企业名称",
        content: "companyName"
    }, {
        title: "企业名称",
        content: "licenseNo"
    }, {
        title: "营业执照副本扫描件",
        content: function (data) {
            return '<img src="' + data.licenseCopy + '"/>';
        }
    }, {
        title: "公司注册详细地址",
        content: "regionFullName"
    }, {
        title: "公司注册城市",
        content: "registerAddress"
    }, {
        title: "联系人姓名",
        content: "contacterName"
    }, {
        title: "联系人身份证号码",
        content: "contacterIdNo"
    }, {
        title: "联系人联系方式",
        content: "contactWay"
    }, {
        title: "手持身份证照片",
        content: function (data) {
            return '<img src="' + data.photo + '"/>';
        }
    }, {
        title: "身份证正面照片",
        content: function (data) {
            return '<img src="' + data.positivePhoto + '"/>';
        }
    }];

    /**
     *
     * @param fields [展现标题]
     * @param data [展现数据]
     * @returns {string}
     */
    function generateProfileForm(fields, data) {
        var html;
        html = '';
        for (var i = 0; i < fields.length; i++) {
            html += '<div class="form-group">';
            html += '<div class="col-sm-2 control-label">' + fields[i].title + '</div>';
            html += '<div class="col-sm-8 profile-item">';

            if (typeof fields[i].content === 'string') {
                html += ((data[fields[i].content] === undefined || data[fields[i].content] === null) ? '' : data[fields[i].content]);
            } else if (typeof fields[i].content === 'function') {
                var str = fields[i].content(data);
                if (typeof str === "undefined") {
                    str = '';
                }
                html += str;
            }
            html += '</div>';
            html += '</div>'
        }
        return html;
    }

    var AuditView = React.createClass({
        mixins: [ReactUI.OverlayMixin],

        fetch: function(config,params) {
            $.post(config.dataSource, params).done(function(data) {
                this.setState({
                    list: data.data.client
                });
            }.bind(this));
        },
        getDefaultProps: function() {
            return ({
                modalTitle:'',
                modalMessage:''
            });
        },
        getInitialState: function() {
          return {
              list: [],
              isModalOpen: false
          };
        },
        componentDidMount: function() {
            this.fetch(config,this.props.model);
        },
        onAudit: function(e) {
            var params = $(e.target).serializeArray();
            params.push({
                name: "clientId",
                value: clientId
            });

            e.preventDefault();
            $.post(config.auditSource, params).done(function(data) {
                if(!data.status) {
                    this.setProps({
                        modalMessage: data.info
                    });
                    this.handleToggle();
                } else {
                    this.setProps({
                        modalMessage: data.info
                    });
                    this.handleToggle();
                }
            }.bind(this));
        },
        handleToggle: function () {
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        },
        render: function() {
            var Nav = ReactUI.Nav;
            var Table = ReactUI.Table;
            var NavItem = ReactUI.NavItem;

            return (
                <div className="wrap">
                    <div className="col-md-2 left-nav">
                        <Nav bsStyle="pills" stacked activeKey={1}>
                            <NavItem eventKey={1} href="#home/index" title="客户管理">客户管理</NavItem>
                            <NavItem eventKey={2} href="#sites/index" title="站点管理">站点管理</NavItem>
                            <NavItem eventKey={3} href="#message/index" title="消息管理">消息管理</NavItem>
                        </Nav>
                    </div>
                    <div className="col-md-10 right-content">
                        <h3>审核广告主信息</h3>

                        <div className="form-horizontal top20" id="profile" dangerouslySetInnerHTML={{__html: generateProfileForm(fields, this.state.list)}}>
                        </div>
                        <form className="form-horizontal" role="form" id="auditForm" onSubmit={this.onAudit}>

                            <div className="form-group" id="auditFormWrap">
                                <label className="col-sm-2 control-label">审核意见</label>

                                <div className="col-sm-10">
                                    <textarea className="form-control" rows="3" name="passIdea" id="audit-passIdea"></textarea>
                                    <span className="hide glyphicon glyphicon-warning-sign form-control-feedback"
                                        id="audit-passIdea-tip"></span>
                                    <select className="form-control col-xs-3 top20 right10" name="passStatus" id="audit-passStatus">
                                        <option value="2">通过</option>
                                        <option value="1">不通过</option>
                                    </select>
                                    <button type="submit" className="btn btn-default top20">确定</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            );
        },
        renderOverlay: function () {
            var Modal = ReactUI.Modal;
            var Button = ReactUI.Button;
            var modalTitle = this.props.modalTitle ? this.props.modalTitle : "提示消息";

            if (!this.state.isModalOpen) {
                return <span/>;
            }

            return (
                <Modal title={modalTitle} onRequestHide={this.handleToggle}>
                    <div className="modal-body">
                        {this.props.modalMessage}
                    </div>
                    <div className="modal-footer">
                        <Button onClick={this.handleToggle}>Close</Button>
                    </div>
                </Modal>
            );
        }
    });

    return AuditView;
});