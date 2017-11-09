import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, message, Modal, Popconfirm, Row, Table } from 'antd';

import styles from './Role.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  role: state.role,
}))
@Form.create()
export default class Role extends PureComponent {
  state = {
    modalVisible: false,
    currentItem: {},
    q: '',
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

    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  };

  handleSearch = () => {
    const { dispatch } = this.props;
    const { q } = this.state;
    dispatch({
      type: 'role/fetch',
      payload: {
        q,
      },
    });
  }

  handleOk = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'role/add',
        payload: {
          ...values,
        },
      });
      this.setState({ modalVisible: false });
      message.success('保存成功');
      form.resetFields();
    });
  }

  handleCancel = () => {
    this.setState({ modalVisible: false });
  }

  openModal = (record) => {
    if (record) {
      this.setState({ currentItem: record });
    } else {
      this.setState({ currentItem: {} });
    }
    this.setState({ modalVisible: true });
  }

  handleRemove = (record) => {
    const ids = [record.id];
    this.props.dispatch({
      type: 'role/remove',
      payload: {
        ids,
      },
    });
    message.success('删除成功');
  }

  handleInputChange = (e) => {
    this.setState({
      q: e.target.value,
    });
  }

  renderForm() {
    const ColProps = {
      xs: 24,
      sm: 12,
      style: {
        marginBottom: 16,
      },
    };
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col {...ColProps} span={24}>
          <Input
            placeholder="名称或代码"
            style={{ width: 200 }}
            onChange={this.handleInputChange}
          />
          <Button type="primary" icon="search" onClick={this.handleSearch}>查询</Button>
          <Button type="primary" onClick={this.openModal}>新增</Button>
        </Col>
      </Row>
    );
  }

  render() {
    const { role: { loading, data, loadingSave } } = this.props;
    const { modalVisible, currentItem } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '名称',
      dataIndex: 'name',
    }, {
      title: '代码',
      dataIndex: 'code',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.openModal(record);
          }}
          >编辑
          </a>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => {
              this.handleRemove(record);
            }}
          >
            &nbsp;&nbsp;<a>删除</a>
          </Popconfirm>
        </span>
      ),
    }];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: data.current,
      total: data.total,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Card title="角色管理" bordered={false} style={{ margin: '0' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
          <Table
            columns={columns}
            dataSource={data.rows}
            loading={loading}
            rowKey="id"
            size="small"
            pagination={paginationProps}
            onChange={this.handleTableChange}
          />
          <Modal
            title="角色编辑"
            visible={modalVisible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleCancel}>取消</Button>,
              <Button key="submit" htmlType="submit" type="primary" loading={loadingSave} onClick={this.handleOk}>
                保存
              </Button>,
            ]}
          >
            <Form layout="vertical">
              {getFieldDecorator('id', {
                initialValue: currentItem.id,
              })(
                <Input type="hidden" />
              )}
              <Form.Item label="名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: currentItem.name,
                  rules: [{
                    required: true, message: '请输入角色名称',
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item label="代码" {...formItemLayout}>
                {getFieldDecorator('code', {
                  initialValue: currentItem.code,
                  rules: [{
                    required: true, message: '请输入代码',
                  }],
                })(
                  <Input />
                )}
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Card>
    );
  }
}
