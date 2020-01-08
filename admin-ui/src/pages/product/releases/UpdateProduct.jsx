
import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { notification, Card, Form, Button, Divider } from 'antd';
import router from 'umi/router';
import { submitProduct, saveProduct } from './service';
import BasicInfoCard from './components/BasicInfoCard';
import AllocationCard from './components/AllocationCard';
import IntoductionCard from './components/IntroductionCard';
import ContractCard from './components/ContractCard';
import constant from '@/pages/Constant';

const FormItem = Form.Item;
const { dateFormat } = constant;

class UpdateProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      saving: false,
    }
  }

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        submitting: true,
      });

      submitProduct(this.formProductDetail(values)).then(resp => {
        if (resp.info && resp.info.val === 2001) {
          notification.open({
            message: '提交成功',
            description: '即将跳转至产品列表',
            duration: 2,
          });
          router.push('/product/list');
        } else {
          notification.open({
            message: '创建失败',
            description: resp.info.msg,
            duration: 5,
          });
        }
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
        return;
      }
      this.setState({
        saving: true,
      });

      saveProduct(this.formProductDetail(values)).then(resp => {
        if (resp.info && resp.info.val === 2001) {
          notification.open({
            message: '保存成功',
            description: '即将跳转至产品列表',
            duration: 3,
          });
          router.push('/product/list');
        } else {
          notification.open({
            message: '保存失败',
            description: resp.info.msg,
            duration: 5,
          });
        }
        this.setState({
          saving: false,
        });
      });
    });
  }

  formProductDetail = values => {
    const basicInfo = {
      preWorkflowId: values.preWorkflowId,
      type: 0, // 默认现金类产品
      code: values.code,
      projectId: values.project.key,
      projectName: values.project.label,
      publishName: values.publishName,
      quota: values.quota,
      releasingStartDate: values.releaseDuration[0].format(dateFormat),
      releasingEndDate: values.releaseDuration[1].format(dateFormat),
      miniAmount: values.miniAmount,
      bankAccount: values.bankAccount,
      issue: values.issue,
      online: values.online,
    }

    const allocations = values.allocations.map(item => ({
      ...item,
      startDate: item.duration[0].format(dateFormat),
      endDate: item.duration[1].format(dateFormat),
    }))

    const introduction = {
      content: values.content,
    }

    return {
      basicInfo,
      allocations,
      introduction,
      introductionMaterials: values.introductionMaterials ? values.introductionMaterials.fileList : null,
      contractMaterials: values.contractMaterials ? values.contractMaterials.fileList : null,
    };
  }

  handleCancel = () => {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { submitting, saving } = this.state;
    const { form } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form style={{ marginBottom: 16 }} layout="vertical">
            <BasicInfoCard form={form} mode="creating" editable/>
            <AllocationCard form={form} mode="creating" editable/>
            <ContractCard form={form} mode="creating" editable/>
            <IntoductionCard form={form} mode="creating" editable/> 
            <Divider />
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit} style={{ marginLeft: 16 }} loading={submitting} >提交</Button>
              <Button type="primary" onClick={this.handleSave} style={{ marginLeft: 16 }} loading={ saving }>保存</Button>
              <Button style={{ marginLeft: 16 }} onClick={this.handleCancel}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(UpdateProduct);
