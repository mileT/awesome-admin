
import React, { PureComponent } from 'react';
import { Card, Form, Input, Col, Row, Select, Spin, Icon, notification } from 'antd';
import OssUpload from '@/components/OssUpload';
import { getManagerCustomer, getCustomerBank, queryFileLink, queryContractUploadPolicy, getAttachment } from '../service';
import dictionary from '@/pages/Dictionary';

const FormItem = Form.Item;
const { Option } = Select;
const { contract: { attachmentType } } = dictionary;

const createFormRow = (component1, component2, component3) => (
  <Row gutter={16}>
    <Col lg={6} md={12} sm={24}>
      {component1}
    </Col>
    <Col xl={{ span: 8, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
      {component2}
    </Col>
    <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
      {component3}
    </Col>
  </Row>
)

const loadingTip = tips => {
  const antIcon = <Icon type="loading" style={{ fontSize: 16 }} spin />
  if (tips && tips.loading) {
    return (<span><Spin indicator={antIcon} style={{ marginRight: 4 }} />{tips.msg}</span>);
  }
  return (<span style={{ color: '#f5222d' }}>{tips ? tips.msg : null}</span>);
}

class ContractorCard extends PureComponent {
  state = {
    beneficiaryOptions: [],
    beneficiaryTips: null,
    consignorOptions: [],
    consignorTips: null,
    bank: [],
    bankTip: null,
    contractUploadPolicy: {},
  };

  componentDidMount() {
    const { form, data } = this.props;
    queryContractUploadPolicy().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          contractUploadPolicy: resp.data,
        });
      } else {
        notification.open({
          message: '获取上传权限失败,无法上传文档',
        });
      }
    });
    getManagerCustomer().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          beneficiaryOptions: resp.data,
          beneficiaryTips: null,
          consignorOptions: resp.data,
          consignorTips: null,
        })
        if (data) {
          form.setFieldsValue({
            identityNum: resp.data.find(item => item.id === data.beneficiaryId).identityNum,
          });
        }
        return;
      }
      this.setState({
        beneficiaryOptions: [],
        beneficiaryTips: { msg: '加载信息失败...' },
        consignorOptions: [],
        consignorTips: { msg: '加载信息失败...' },
      })
    });
    if (data && data.id) {
      getAttachment(data.id).then(resp => {
        if (resp.info && resp.info.val === 2001) {
          form.setFieldsValue({
            videos: {
              fileList: resp.data.filter(item => item.type.val === attachmentType.video.val)
                  .map(item => ({ ...item, uid: item.id, status: 'done' })),
              },
          });
          form.setFieldsValue({
            pictures: {
              fileList: resp.data.filter(item => item.type.val === attachmentType.picture.val)
                .map(item => ({ ...item, uid: item.id, status: 'done' })),
              },
          });
    } else {
      notification.open({
        message: '获取附件失败',
        duration: 5,
      });
    }
  })
}
  }

handleBeneficiaryChange(value) {
  const { form } = this.props;
  const { beneficiaryOptions, consignorOptions } = this.state;

  const beneficiary = beneficiaryOptions.find(item => item.id === value);
  const consignor = consignorOptions.find(item => item.id === value);

  form.setFieldsValue({
    identityNum: beneficiary ? beneficiary.identityNum : null,
    consignorId: consignor ? consignor.id : null,
    bankAccount: null,
  })

  if (beneficiary) {
    getCustomerBank(beneficiary.id).then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          bank: resp.data,
          bankTip: resp.data.length > 0 ? null : { msg: '无银行卡信息，请在crm创建银行卡' },
        });
        if (resp.data.length === 1) {
          form.setFieldsValue({
            bankAccount: resp.data[0].account,
          })
        }
        return;
      }
      this.setState({
        bank: [],
        bankTip: { msg: '银行卡信息获取失败' },
      });
    })
  }
}

render() {
  const { form: { getFieldDecorator }, data, editable } = this.props;
  const { beneficiaryOptions, beneficiaryTips, consignorOptions,
    consignorTips, bank, bankTip, contractUploadPolicy } = this.state;
  const fileList = data && data.fileList ?
    {
      fileList: data.map(item => ({ ...item, uid: item.id, status: 'done' })),
    } : null;

  return (
    <Card bordered={false} title="受益-委托人">
      {createFormRow(
        (
          <FormItem label="受益人" extra={loadingTip(beneficiaryTips)}>
            {getFieldDecorator('beneficiaryId', {
              initialValue: data ? data.beneficiaryId : null,
              rules: [{
                required: true,
                message: '选择受益人',
              }],
            })(<Select
              showSearch
              disabled={!editable}
              dropdownMatchSelectWidth={false}
              placeholder="请选择受益人"
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }
              onChange={value => this.handleBeneficiaryChange(value)}
            >
              {beneficiaryOptions.map(item => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>)}
          </FormItem>
        ),
        (
          <FormItem label="受益帐号" extra={loadingTip(bankTip)}>
            {getFieldDecorator('bankAccount', {
              initialValue: data ? data.bankAccount : null,
              rules: [{
                required: true,
                message: '选择受益帐号',
              }],
            })(<Select
              showSearch
              disabled={!editable}
              placeholder="请选择帐号"
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }>
              {
                bank.map(item => (
                  <Option key={item.account}>{item.account}</Option>
                ))
              }
            </Select>)}
          </FormItem>
        ),
        (
        <FormItem label="证件号">
          {getFieldDecorator('identityNum', {
            initialValue: data ? data.identityNum : null,
            rules: [{
              required: true,
              message: '证件号码',
            }],
          })(<Input disabled addonBefore="身份证" placeholder="输入证件号码" />)}
        </FormItem>
      ))
      }
      {createFormRow(
        (
          <FormItem label="委托人" extra={loadingTip(consignorTips)}>
            {getFieldDecorator('consignorId', {
              initialValue: data ? data.consignorId : null,
              rules: [{
                required: true,
                message: '选择委托人',
              }],
            })(<Select disabled={!editable} placeholder="请选择委托人" dropdownMatchSelectWidth={false}>
              {consignorOptions.map(item => (
                <Option key={item.id}>{item.name}</Option>
              ))}
            </Select>)}
          </FormItem>),
        (
          <FormItem label="录像附件:">
            {getFieldDecorator('videos', {
              initialValue: fileList,
              rules: [
                {
                  required: false,
                  message: '请上传双录图像',
                },
              ],
            })(
              <OssUpload
                policy={contractUploadPolicy}
                editable={editable}
                link={queryFileLink}
                style={{ width: 500 }} />)}
          </FormItem>),
        (
          <FormItem label="图片附件:">
            {getFieldDecorator('pictures', {
              initialValue: fileList,
              rules: [
                {
                  required: false,
                  message: '请上传双录图片',
                },
              ],
            })(
              <OssUpload
                policy={contractUploadPolicy}
                editable={editable}
                link={queryFileLink}
                style={{ width: 500 }} />)}
          </FormItem>),
      )
      }
    </Card>
  );
}
}

export default ContractorCard;
