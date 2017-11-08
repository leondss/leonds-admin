import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Table,
  Button,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Role.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  role: state.role,
}))
@Form.create()
export default class Role extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current - 1,
      rowCount: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    console.log(params);

    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    const { dispatch } = this.props;
    if (e) {
      console.log(e);
      this.setState({
        formValues: e,
      });

      dispatch({
        type: 'role/fetch',
        payload: {
          q: e,
        },
      });
    }
  }

  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: this.state.addInputValue,
      },
    });

    message.success('添加成功');
  }

  renderForm() {
    const { selectedRows } = this.state;
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <Input.Search
            placeholder="输入名称或代码查询"
            style={{ width: 200 }}
            onSearch={this.handleSearch}
          />
          <Button type="primary">新增</Button>
          <Button type="primary">编辑</Button>
          {
            selectedRows.length > 0 && (
              <Button type="primary">删除({selectedRows.length})</Button>
            )
          }

        </Col>
      </Row>
    );
  }

  render() {
    const { role: { loading, data } } = this.props;
    const { selectedRows } = this.state;

    const columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '代码',
      dataIndex: 'code',
    }];

    const rowSelection = {
      selectedRows,
      onChange: this.handleSelectRows,
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: data.current,
      total: data.total,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data.rows}
              loading={loading}
              rowKey="id"
              pagination={paginationProps}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
