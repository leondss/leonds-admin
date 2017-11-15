import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, message, Row, Select, Spin } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import styles from './PostsEdit.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select;

@connect(state => ({
  postsEdit: state.postsEdit,
}))
@Form.create()
export default class PostsEdit extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'postsEdit/fetchCategory' });
    dispatch({ type: 'postsEdit/fetchTag' });
  }

  handleSubmit = (status) => {
    const { dispatch, form } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const formData = { ...values, status };
        formData.category = formData.category.join(',');
        formData.tag = formData.tag.join(',');
        dispatch({
          type: 'postsEdit/save',
          payload: formData,
        });
        message.success('操作成功');
      }
    });
  }
  handleSubmitDraft = () => {
    this.handleSubmit('draft');
  }
  handleSubmitPublish = () => {
    this.handleSubmit('publish');
  }

  render() {
    const { postsEdit: { data, categoryData, tagData, loadingEdit } } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout title="文章发布">
        <Spin spinning={loadingEdit}>
          <Card
            title="基本信息"
            bordered={false}
            className={styles.card}
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <FormItem label="标题">
                    {getFieldDecorator('title', {
                      initialValue: data.title,
                      rules: [{
                        required: true, message: '请输入文章标题',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem label="分类">
                    {getFieldDecorator('category', {
                      initialValue: data.title,
                      rules: [{
                        required: true, message: '请选择分类',
                      }],
                    })(
                      <Select
                        mode="tags"
                      >
                        {categoryData.map(d => <Option key={d.name}>{d.name}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                  <FormItem label="标签">
                    {getFieldDecorator('tag', {
                      initialValue: data.title,
                      rules: [{
                        required: true, message: '请选择标签',
                      }],
                    })(
                      <Select
                        mode="tags"
                      >
                        {tagData.map(d => <Option key={d.name}>{d.name}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card
            title="内容信息"
            bordered={false}
            className={styles.card}
          >
            <Form>
              <FormItem
                wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}
                hasFeedback
              >
                {getFieldDecorator('content', {
                  initialValue: data.content,
                  rules: [{
                    required: true, message: '请输入内容',
                  }],
                })(
                  <TextArea rows={15} />
                )}
              </FormItem>
            </Form>
          </Card>
        </Spin>
        <FooterToolbar>
          <Button type="primary" onClick={this.handleSubmitPublish}>发布</Button>
          <Button onClick={this.handleSubmitDraft}>保存草稿</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
