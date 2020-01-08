
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, notification, Card, Form, Input, Button, Table } from 'antd';
import { queryQuestionnaireResult } from '@/services/questionnaire';

const FormItem = Form.Item;

@connect(({ questionnaires, loading }) => ({
  questionnaires,
  loading: loading.effects['questionnaires/fetch'],
}))
@Form.create()
class Questionnaire extends PureComponent {
  columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '证件类型',
      dataIndex: 'identityType.msg',
    },
    {
      title: '证件号码',
      dataIndex: 'identityNum',
    },
    {
      title: '问卷评分',
      dataIndex: 'score',
    },
    {
      title: '问卷等级',
      dataIndex: 'levelRate',
    },
    {
      title: '评估时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'link',
      render: val => (
        <a href = {val} target = "blank">
          问卷结果
        </a>
      ),
    },
  ]

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    }
  }

  handleSearch = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.setState({ submitting: true });

      queryQuestionnaireResult(values).then(resp => {
        this.setState({ submitting: false });
        if (resp.info && resp.info.val !== 2001) {
          notification.error({
            message: '请求出错',
            description: resp.info.msg,
            duration: 4,
          });
          return;
        }
        dispatch({
          type: 'questionnaires/query',
          payload: resp,
        });
      })
    });
  }

  render() {
    const { questionnaires, form: { getFieldDecorator } } = this.props;
    const { submitting } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Alert style={{ marginBottom: 16 }} message="输入的证件号码需与客户风险评估问卷上填写的证件号码一致" type="info" showIcon />
          <Form style={{ marginBottom: 16 }} onSubmit={this.handleSearch} layout="inline">
            <FormItem label="客户名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入客户名称',
                }],
              })(<Input style={{ width: 250 }} placeholder="请输入客户名称" />)}
            </FormItem>
            <FormItem label="证件号码">
              {getFieldDecorator('identityNum', {
                rules: [{
                  required: true,
                  message: '请输入证件号',
                }],
              })(<Input style={{ width: 250 }} placeholder="请输入证件号" />)}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" loading={submitting}>
                查询
              </Button>
            </FormItem>
          </Form>
          <Table
            rowKey={item => item.id}
            loading={submitting}
            dataSource={questionnaires.data}
            columns={this.columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Questionnaire;
