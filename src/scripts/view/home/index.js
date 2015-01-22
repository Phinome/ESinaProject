/**
 * Created by phinome on 1/19/15.
 * Home React View
 */

define([
    "jquery",
    "react",
    "react-bootstrap",
    "moment",
    "css!styles/home"
], function($, React, ReactUI, moment) {
    "use strict";
    var HomeView = React.createClass({

        fetch: function(page) {
            var params = {
                pageNo : page || 1
            }

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
               dataSource: '/admanager/client/list',
               totalCount: 0,
               auditStatus: ['','待审核','已通过','不通过']
           });
        },
        getInitialState: function() {
          return ({
              pageNo: 1,
              list: []
          });
        },
        componentDidMount: function() {
          this.fetch();
        },
        onSearch: function(e) {
            var params = $(e.target).serialize();

            e.preventDefault();
            $.post(this.props.dataSource, params).done(function(data) {
                this.setState({
                    list: data.data.page.list
                });
            }.bind(this));
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
                        <form className="form-inline form-search" role="form" onSubmit={this.onSearch}>
                            <div className="form-group">
                                <label htmlFor="companyName" className="col-sm-1 control-label search-label">客户名称</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" id="companyName" name="companyName" placeholder="请输入公司名称" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="passStatus" className="col-sm-offset-1 col-sm-1 control-label search-label">审核状态</label>
                                <div className="col-sm-3">
                                    <select className="form-control" name="passStatus">
                                        <option value="-1">全部</option>
                                        <option value="1">未审核</option>
                                        <option value="3">不通过</option>
                                        <option value="2">已通过</option>
                                    </select>
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
                                    <th>客户名称</th>
                                    <th>提交时间</th>
                                    <th>审核状态</th>
                                    <th>审核人</th>
                                    <th>审核时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.list.map(function(item, i) {
                                    var submitTime = item.submitTime ? moment(parseInt(item.submitTime,10)).format("YYYY-MM-DD") : '-';
                                    var lastCheckTime = item.lastCheckTime ? moment(parseInt(item.lastCheckTime,10)).format("YYYY-MM-DD") : '-';
                                    var auditStatus = this.props.auditStatus[item.passStatus];
                                    var auditURL = "#home/audit/clientId:"+item.clientId;
                                    return (
                                        <tr key={i}>
                                            <td>{item.clientId}</td>
                                            <td>{item.companyName}</td>
                                            <td>{submitTime}</td>
                                            <td>{auditStatus}</td>
                                            <td>{item.auditUserName}</td>
                                            <td>{lastCheckTime}</td>
                                            <td className="text-center">
                                                <a href={auditURL} className="btn btn-info">资质审核</a>
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
        }
    });

    return HomeView;
});