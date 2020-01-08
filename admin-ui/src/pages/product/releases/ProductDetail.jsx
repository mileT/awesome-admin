import { Form, Divider, Button, Card, notification } from 'antd';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import BasicInfoCard from './components/BasicInfoCard';
import AllocationCard from './components/AllocationCard';
import IntoductionCard from './components/IntroductionCard';
import ContractCard from './components/ContractCard';
import { queryProductDetail } from './service';

const FormItem = Form.Item;

class ProductDetail extends PureComponent {
  state = {
    loading: true,
    product: null,
  }

  componentDidMount() {
    const { data } = this.props;
    queryProductDetail(data.id).then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          product: resp.data,
          loading: false,
        })
      } else {
        notification.open({
          message: '获取产品信息失败',
          description: '即将跳转至产品列表',
          duration: 3,
        });
        router.push('/product/list');
      }
    })
  }

  handleSubmit = () => {
    const { product } = this.state;
    const { form, handleDetailSubmit } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        if (!fieldsValue.allocations || fieldsValue.allocations.length <= 0) {
          notification.open({
            message: '分配方案不可以为空',
            duration: 4,
          });
        }
        return
      }
      if (handleDetailSubmit) {
        handleDetailSubmit(product, fieldsValue);
      }
    });
  };

  handleRollback = () => {
    const { product } = this.state;
    const { form, handleDetailRollback } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        if (!fieldsValue.allocations || fieldsValue.allocations.length <= 0) {
          notification.open({
            message: '分配方案不可以为空',
            duration: 4,
          });
        }
        return
      }
      if (handleDetailRollback) {
        handleDetailRollback(product, fieldsValue);
      }
    });
  };

  handleSave = () => {
    const { editable, product } = this.state;
    if (editable === false) {
      this.handleCancel();
      return;
    }
    const { form, handleDetailSave } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        if (!fieldsValue.allocations || fieldsValue.allocations.length <= 0) {
          notification.open({
            message: '分配方案不可以为空',
            duration: 4,
          });
        }
        return
      }
      if (handleDetailSave) {
        handleDetailSave(product, fieldsValue);
      }
    });
  }

  handleCancel = () => {
    const { triggerModalVisibel } = this.props;
    triggerModalVisibel();
  }

  render() {
    const { form, triggerModalVisibel, mode, editable, canRollback } = this.props;
    const { loading, product } = this.state
    return (
      <Card bordered={false} loading={loading}
        title={(<a href="#" style={{ marginBottom: 16, marginLeft: 0 }} onClick={() => triggerModalVisibel()}>返回</a>)}>
        <Form style={{ marginBottom: 16 }} layout="vertical">
          <BasicInfoCard form={form} mode={mode} editable={editable}
            data={product ? product.basicInfo : null} />
          <AllocationCard form={form} mode={mode} editable={editable}
            data={product ? product.allocations : null} />
          <ContractCard form={form} mode={mode} editable={editable}
            data={product && product.contractMaterials ? product.contractMaterials : null} />
          <IntoductionCard form={form} mode={mode} editable={editable}
            data={product ?
              {
                introduction: product.introduction,
                introductionMaterials: product.introductionMaterials,
              }
              : null}
          />
          <Divider />
          {!editable ? null : (
            <FormItem>
              <Button type="primary" style={{ marginLeft: 16 }} onClick={() => this.handleSubmit()} loading={false} >提交</Button>
              {canRollback ? (
                <Button type="primary" style={{ marginLeft: 16 }} onClick={() => this.handleRollback()}>退回</Button>
              ) : (
                <Button type="primary" style={{ marginLeft: 16 }} onClick={() => this.handleSave()}>保存</Button>
              )}
              <Button style={{ marginLeft: 16 }} onClick={() => this.handleCancel()}>取消</Button>
            </FormItem>
          )}
        </Form>
      </Card>
    );
  }
}

export default Form.create()(ProductDetail);
