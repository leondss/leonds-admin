import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, message, Popconfirm, Row, Table, Radio } from 'antd';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

@connect(state => ({
  role: state.role,
}))
@Form.create()
export default class Terms extends PureComponent {
  state = {
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

  handleOk = (e) => {
    e.stopPropagation();
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
      message.success('保存成功');
      form.resetFields();
    });
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

  handleChange = (value, key, column) => {
    console.log(column);
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
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
        </Col>
      </Row>
    );
  }

  render() {
    const { role: { loading, data, loadingSave } } = this.props;
    const { currentItem } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [{
      title: '名称',
      dataIndex: 'name',
      render: (text, record) => this.renderColumns(text, record, 'name'),
    }, {
      title: '代码',
      dataIndex: 'code',
      render: (text, record) => this.renderColumns(text, record, 'code'),
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const { editable } = record;
        return (
          <div>
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.key)}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                : <a onClick={() => this.edit(record.key)}>Edit</a>
            }
          </div>
        );
      },
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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      <Card title="分类" bordered={false} style={{ margin: '0' }}>
        <Row gutter={2}>
          <Col md={8}>
            <h3>添加分类</h3><br />
            <Form layout="vertical" onSubmit={this.handleOk}>
              {getFieldDecorator('id', {
                initialValue: currentItem.id,
              })(
                <Input type="hidden" />
              )}
              <Form.Item label="名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: currentItem.name,
                  rules: [{
                    required: true, message: '请输入名称',
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
              <Form.Item label="类别" {...formItemLayout}>
                {getFieldDecorator('taxonomy', {
                  initialValue: currentItem.taxonomy,
                  rules: [{
                    required: true, message: '请选择类别',
                  }],
                })(
                  <Radio.Group>
                    <Radio value="category">分类</Radio>
                    <Radio value="tag">标签</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loadingSave}>
                  保存
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col md={15}>
            <div>
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
          </Col>
        </Row>
      </Card>
    );
  }
}
