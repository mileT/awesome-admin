import React, { PureComponent } from 'react';
import { Form, Button, Divider } from 'antd';
import ReactToPrint from 'react-to-print';
import BasicCard from './components/BasicCard';
import ContractorCard from './components/ContractorCard';
import PaymentCard from './components/PaymentCard';
import Receipt from './components/Receipt';

const FormItem = Form.Item;

class ContractDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      saving: false,
    }
  }

  handleCancel = () => {
    const { footerButtons } = this.props;
    if (footerButtons.cancel) {
      footerButtons.cancel();
    }
  }

  handleSubmit = () => {
    const { form, footerButtons, data } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.setState({
        submitting: true,
      });

      if (footerButtons.submit) {
        footerButtons.submit(data, values);
      }

      this.setState({
        submitting: false,
      });
    });
  }

  handleSave = () => {
    const { form, data, footerButtons } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (footerButtons.save) {
        footerButtons.save(data, values);
      }
    })
  }

  handleRollBack = () => {
    const { form, data, footerButtons } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (footerButtons.rollback) {
        footerButtons.rollback(data, values);
      }
    })
  }

  render() {
    const { submitting, saving } = this.state;
    const { form, editable, data, footerButtons } = this.props;

    return (
      <Form style={{ marginBottom: 16 }} layout="vertical">
        <BasicCard form={form} editable={editable} data={data}/>
        <ContractorCard form={form} editable={editable} data={data}/>
        <PaymentCard form={form} editable={editable} data={data}/>
        <Divider />
        <FormItem>
          {
            <ReactToPrint
              style={{ marginLeft: 16 }}
              trigger={() => (<Button href="#">打印认购单</Button>)}
              content = {() => this.printRef}
            />
          }
          {
            (<Button type="primary" onClick={this.printOrder} style={{ marginLeft: 16 }} loading={saving}>打印</Button>)
          }
          {
            footerButtons.submit
              ? (<Button type="primary" onClick={this.handleSubmit} style={{ marginLeft: 16 }} loading={submitting} >提交</Button>)
              : null
          }
          {
            footerButtons.save
              ? (<Button type="primary" onClick={this.handleSave} style={{ marginLeft: 16 }} loading={saving}>保存</Button>)
              : null
          }
          {
            footerButtons.rollback
              ? (<Button type="primary" onClick={this.handleRollBack} style={{ marginLeft: 16 }} loading={saving}>退回</Button>)
              : null
          }
          {
            footerButtons.cancel
              ? (<Button style={{ marginLeft: 16 }} onClick={this.handleCancel}>取消</Button>)
              : null
          }
        </FormItem>
        <div style={{ display: 'none' }}>
          <Receipt style={{ width: '210mm', height: '297mm' }} ref={el => ( this.printRef = el )} data={form.getFieldsValue()} />
        </div>
      </Form>

    );
  }
}

export default Form.create()(ContractDetail);
