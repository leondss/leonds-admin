import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Radio, Input, Button, Popconfirm } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Posts.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(state => ({
  posts: state.posts,
}))
export default class Posts extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'posts/fetch',
      payload: {
        count: 5,
      },
    });
  }

  render() {
    const { posts: { data, loading } } = this.props;

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">已发布</RadioButton>
          <RadioButton value="waiting">草稿</RadioButton>
          <RadioButton value="waiting">回收站</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={() => ({})}
        />
      </div>
    );

    const columns = [{
      title: '标题',
      dataIndex: 'title',
    }, {
      title: '状态',
      dataIndex: 'status',
    }, {
      title: '发布时间',
      dataIndex: 'publishTime',
    }, {
      title: '评论数',
      dataIndex: 'commentCount',
    }, {
      title: '好评数',
      dataIndex: 'goodCount',
    }, {
      title: '阅读量',
      dataIndex: 'viewCount',
    }, {
      title: '创建人',
      dataIndex: 'creator',
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

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="文章列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加
            </Button>
            <Table
              columns={columns}
              dataSource={data.rows}
              loading={loading}
              rowKey="id"
              size="middle"
              pagination={paginationProps}
              onChange={this.handleTableChange}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
