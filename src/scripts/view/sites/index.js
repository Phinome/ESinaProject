/**
 * Created by phinome on 1/19/15.
 * Sites React View
 */

define([
    "jquery",
    "react",
    "react-bootstrap",
    "moment",
    "css!styles/sites"
], function($, React, ReactUI, moment) {
    "use strict";

    var config = {
        offineSource : "/admanager/site/offline",
        dataSource : "/admanager/site/list"
    };

    var SitesView = React.createClass({
        mixins: [ReactUI.OverlayMixin],

        fetch: function(page) {
            var params = {
                pageNo: page || 1
            };
            $.post(config.dataSource, params).done(function(data) {
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
                modalTitle:'',
                modalMessage:'',
                totalCount: 0
            });
        },
        getInitialState: function() {
            return ({
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
        onSearch: function(e) {
            var params = $(e.target).serialize();

            e.preventDefault();
            $.post(config.dataSource, params).done(function(data) {
                this.setState({
                    list: data.data.page.list,
                    pageNo: data.data.page.pageNo
                });
            }.bind(this));
        },
        onClick: function(e) {
            e.preventDefault();

            var params = {siteId:$(e.target).data('id')};

            $.post(config.offineSource, params).done(function(data) {
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
                        <Nav bsStyle="pills" stacked activeKey={2}>
                            <NavItem eventKey={1} href="#home/index" title="客户管理">客户管理</NavItem>
                            <NavItem eventKey={2} href="#sites/index" title="站点管理">站点管理</NavItem>
                            <NavItem eventKey={3} href="#message/index" title="消息管理">消息管理</NavItem>
                        </Nav>
                    </div>
                    <div className="col-md-10 right-content">
                        <form className="form-inline form-search" role="form" onSubmit={this.onSearch}>
                            <div className="form-group">
                                <label htmlFor="siteName" className="col-sm-1 control-label search-label">站点名称</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" id="siteName" name="siteName" placeholder="请输入站点名称" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="companyName" className="col-sm-1 control-label search-label">客户名称</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" id="companyName" name="companyName" placeholder="请输入公司名称" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-6 col-sm-2">
                                    <button type="submit" className="btn btn-default">搜索</button>
                                </div>
                            </div>
                        </form>
                        <Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>站点名称</th>
                                    <th>站点域名</th>
                                    <th>站点状态</th>
                                    <th>客户名称</th>
                                    <th>发布时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.list.map(function(item, i) {
                                    var releaseTime = !releaseTime ? '-' : moment(parseInt(item.releaseTime,10)).format("YYYY-MM-DD");
                                    var disabled = item.publishStatus === 5 ? 'btn btn-info' : 'btn btn-info disabled';
                                    var previewURL = "http://z.sina.com.cn/"+ item.siteDomain;

                                    return (
                                        <tr key={i}>
                                            <td>{item.siteId}</td>
                                            <td>{item.siteName}</td>
                                            <td>{item.siteDomain}</td>
                                            <td>{item.publishStatusStr}</td>
                                            <td>{item.clientName}</td>
                                            <td>{releaseTime}</td>
                                            <td className="text-center">
                                                <a href="javascript:void(0);" data-id={item.siteId} className={disabled} onClick={this.onClick}>下线</a>
                                                &nbsp;&nbsp;<a href={previewURL} className={disabled}>预览</a>
                                            </td>
                                        </tr>
                                    );
                                }, this)}
                            </tbody>
                        </Table>
                        <div id="pager"></div>
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

    return SitesView;
});