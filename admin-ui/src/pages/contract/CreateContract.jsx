import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Divider, notification } from 'antd';
import router from 'umi/router';
import BasicCard from './components/BasicCard';
import ContractorCard from './components/ContractorCard';
import PaymentCard from './components/PaymentCard';
import { createContract } from './service';
import dictionary from '@/pages/Dictionary';
import { response } from '@/utils/utils';


const { contract: { status } } = dictionary;
const FormItem = Form.Item;

class CreateContract extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      saving: false,
    }
  }

  handleCancel = () => {
    const { form } = this.props;
    form.resetFields();
  }

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        if (err.payments) {
          notification.open({
            message: '无缴款记录',
          })
        }
        return;
      }

      this.setState({
        submitting: true,
      });

      const params = {
        ...values,
        pictures: values.pictures && values.pictures.fileList ? values.pictures.fileList : [],
        videos: values.videos && values.videos.fileList ? values.videos.fileList : [],
        status: status.waitingForReview.val,
      }

      createContract(params).then(resp => {
        response(resp, '提交', () => (router.push('/contract/mine')));
        this.setState({
          submitting: false,
        });
      });
    });
  }

  handleSave = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        if (err.payments) {
          notification.open({
            message: '无缴款记录',
          })
        }
        return;
      }

      this.setState({
        saving: true,
      });

      const params = {
        ...values,
        pictures: values.pictures && values.pictures.fileList ? values.pictures.fileList : [],
        videos: values.videos && values.videos.fileList ? values.videos.fileList : [],
        status: status.waitingForSubmit.val,
      }

      createContract(params).then(resp => {
        response(resp, '保存', () => (router.push('/contract/mine')));
        this.setState({
          saving: false,
        });
      });
    });
  }

  render() {
    const { submitting, saving } = this.state;
    const { form } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form style={{ marginBottom: 16 }} layout="vertical">
            <BasicCard form={form} editable />
            <ContractorCard form={form} editable />
            <PaymentCard form={form} editable />
            <Divider />
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit} style={{ marginLeft: 16 }} loading={submitting} >提交</Button>
              <Button type="primary" onClick={this.handleSave} style={{ marginLeft: 16 }} loading={saving}>保存</Button>
              <Button style={{ marginLeft: 16 }} onClick={this.handleCancel}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CreateContract);
