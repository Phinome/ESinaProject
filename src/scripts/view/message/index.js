/**
 * Created by phinome on 1/20/15.
 * Message React View
 */

define([
    "jquery",
    "react",
    "react-bootstrap",
    "moment",
    "css!styles/message"
], function($, React, ReactUI, moment) {
    "use strict";

    var MessageView = React.createClass({
        mixins: [ReactUI.OverlayMixin],

        fetch: function(page) {
            var params = {
                pageNo: page || 1
            };
            $.post(this.props.dataSource, params).done(function(data) {
                this.setState({
                    list: data.data.page.list,
                    pageNo: data.data.page.pageNo
                });

                this.setProps({
                    totalCount: data.data.page.totalCount
                });
                suzhan.util.pager(data.data.page.pageNo, Math.ceil(data.data.page.totalCount/data.data.page.pageSize), this.fetch);

            }.bind(this));
        },

        getDefaultProps: function() {
            return ({
                dataSource: '/admanager/message/list',
                sendMessageSource: '/admanager/message/send',
                deleteMessageSource: '/admanager/message/delete',
                messageDetailSource: '/admanager/message/message',
                modalTitle:'',
                modalMessage:'',
                totalCount: 0
            });
        },
        getInitialState: function() {
            return ({
                tabKey: 1,
                pageNo: 1,
                list: [],
                isModalOpen: false
            });
        },
        componentDidMount: function() {
            this.fetch();
        },
        onSelect: function(selectKey) {
            this.setState({
                NavItemKey : selectKey
            });
            location.href = this.href;
        },
        onDelete: function(e) {
            e.preventDefault();

            var params = {messageIds:$(e.target).data('id')};

            $.post(this.props.deleteMessageSource, params).done(function(data) {
                if(!data.status) {
                    this.setProps({
                        modalMessage: data.info
                    });
                    this.handleToggle();
                    this.fetch();
                    this.forceUpdate();
                } else {
                    this.setProps({
                        modalMessage: data.info
                    });
                    this.handleToggle();
                }
            }.bind(this));
        },
        onSend: function(e) {
            e.preventDefault();

            var params = $(e.target).serialize();

            $.post(this.props.sendMessageSource, params).done(function(data) {
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
        onReadInfo: function(e) {
            e.preventDefault();

            var params = {messageId:$(e.target).data('id')};

            $.post(this.props.messageDetailSource, params).done(function(data) {
                if(!data.status) {
                    this.setProps({
                        modalTitle: data.data.message.title,
                        modalMessage: data.data.message.content
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
        fetchMessages: function(selectKey) {
            if(selectKey === 2) {
                $.post(this.props.dataSource).done(function(data) {
                    this.setState({
                        tabKey: selectKey,
                        list: data.data.page.list,
                        pageNo: data.data.page.pageNo
                    });

                    this.setProps({
                        totalCount: data.data.page.totalCount
                    });
                }.bind(this));
            }else {
                this.setState({
                    tabKey: selectKey
                });
            }
        },
        render: function() {
            var Nav = ReactUI.Nav;
            var Table = ReactUI.Table;
            var NavItem = ReactUI.NavItem;
            var TabbedArea = ReactUI.TabbedArea;
            var TabPane = ReactUI.TabPane;

            return (
                <div className="wrap">
                    <div className="col-md-2 left-nav">
                        <Nav bsStyle="pills" stacked activeKey={3}>
                            <NavItem eventKey={1} href="#home/index" title="客户管理">客户管理</NavItem>
                            <NavItem eventKey={2} href="#sites/index" title="站点管理">站点管理</NavItem>
                            <NavItem eventKey={3} href="#message/index" title="消息管理">消息管理</NavItem>
                        </Nav>
                    </div>
                    <div className="col-md-10 right-content">
                        <TabbedArea activeKey={this.state.tabKey}  onSelect={this.fetchMessages}>
                            <TabPane eventKey={1} tab="消息发送">
                                <form className="form-horizontal form-message" role="form" onSubmit={this.onSend}>
                                    <div className="form-group">
                                    <label className="col-sm-2 control-label">收件人</label>
                                        <div className="col-sm-4">
                                            <select className="form-control" name="clientId">
                                                <option value="0">全部</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="title" className="col-sm-2 control-label">发送主题</label>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" id="title" name="title" placeholder="消息标题" />
                                            </div>
                                        </div>
                                    <div className="form-group">
                                        <label htmlFor="info" className="col-sm-2 control-label">发送内容</label>
                                        <div className="col-sm-6">
                                            <textarea className="form-control" rows="3" id="info" name="info"></textarea>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-offset-2 col-sm-6">
                                            <button type="submit" className="btn btn-default">发送</button>
                                        </div>
                                    </div>
                                </form>
                            </TabPane>
                            <TabPane eventKey={2} tab="消息列表">
                                <Table striped bordered condensed hover className="message-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>收件人</th>
                                            <th>主题</th>
                                            <th>发送时间</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.list.map(function(item, i) {
                                            var sendTime = !sendTime ? '-' : moment(parseInt(item.sendTime,10)).format("YYYY-MM-DD");
                                            return (
                                                <tr key={i}>
                                                    <td>{item.messageId}</td>
                                                    <td></td>
                                                    <td>{item.title}</td>
                                                    <td>{sendTime}</td>
                                                    <td className="text-center">
                                                        <a href="javascript:void(0);" data-id={item.messageId} className="btn btn-danger" onClick={this.onDelete}>删除</a>
                                                    &nbsp;&nbsp;<a href="javascript:void(0);" data-id={item.messageId} className="btn btn-info" onClick={this.onReadInfo}>详情</a>
                                                    </td>
                                                </tr>
                                            );
                                        }, this)}
                                    </tbody>
                                </Table>
                                <div id="pager"></div>
                            </TabPane>
                        </TabbedArea>
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

    return MessageView;
});