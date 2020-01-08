
import React, { PureComponent } from 'react';
import { Card, Form, Input, Col, Row, Select, DatePicker, Spin, Icon } from 'antd';
import moment from 'moment';
import Constant from '@/pages/Constant';
import { queryProductSelectOptions, queryProductSimpleInfo } from '../service';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { dateFormat } = Constant;

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

class BasicInfoCard extends PureComponent {
  state = {
    productOptions: [],
    productOptionsTip: null,
    projectOptionTip: null,
    allocations: [],
    allocationsTip: null,
  }

  componentDidMount() {
    this.setState({
      productOptionsTip: { loading: true, msg: '正在加载...' },
    })

    queryProductSelectOptions().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          productOptionsTip: null,
          productOptions: resp.data,
        })
        return;
      }
      this.setState({
        productOptionsTip: { msg: '获取产品信息失败' },
        productOptions: [],
      })
    })

    const { data } = this.props;
    if (data && data.allocation) {
      this.setState({
        allocations: [data.allocation],
      });
    }
  }

  handleProductChange(value) {
    this.setState({
      projectOptionTip: { loading: true, msg: '正在加载信息...' },
      allocationsTip: { loading: true, msg: '正在加载信息...' },
    })

    const { form } = this.props;
    queryProductSimpleInfo(value).then(resp => {
      let projectName = null;

      if (resp.info && resp.info.val === 2001) {
        this.setState({
          projectOptionTip: null,
          allocationsTip: null,
          allocations: resp.data.allocations,
        });
        projectName = resp.data.project.projectName || null;
      } else {
        this.setState({
          projectOptionTip: { msg: '获取项目信息失败' },
          allocationsTip: { msg: '获取分配方案失败' },
          allocations: [],
        })
      }
      form.setFieldsValue({
        projectName,
        allocationId: null,
        duration: null,
        rate: null,
      });
    });
  }

  handleAllocationChange(value) {
    const { allocations } = this.state;
    const val = parseInt(value, 10);
    const selectedAllocation = allocations.find(item => item.id === val);
    const { form } = this.props;
    form.setFieldsValue({
      duration: selectedAllocation ? [
        moment(selectedAllocation.startDate, dateFormat),
        moment(selectedAllocation.endDate, dateFormat),
      ]
      : null,
      rate: selectedAllocation ? selectedAllocation.rate : null,
    });
  }

  render() {
    const { form: { getFieldDecorator }, editable, data } = this.props;
    const { productOptions, productOptionsTip, projectOptionTip,
      allocationsTip, allocations } = this.state;
    return (
      <Card bordered={false} title="基础信息">
        {createFormRow(
        (
          <FormItem label="产品信息" extra={loadingTip(productOptionsTip)}>
            {getFieldDecorator('productId', {
              initialValue: data ? `${data.productId}` : null,
              rules: [{
                required: true,
                message: '选择产品',
              }],
            })(<Select
                showSearch
                disabled={!editable}
                placeholder="请选择产品"
                dropdownMatchSelectWidth={false}
                filterOption={(input, option) =>
                  option.props.children.indexOf(input) >= 0
                }
                onChange={value => this.handleProductChange(value)}>
              {
                productOptions.map(option => (
                  (<Option key={`${option.productId}`}>{option.publishName}</Option>)
                ))
              }
            </Select>)}
          </FormItem>
        ),
        (
          <FormItem label="合同额度" required>
            {getFieldDecorator('amount', {
              initialValue: data ? data.amount : null,
              rules: [
                {
                  required: true,
                  pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                  message: '请输入整数金额(万元)',
                },
              ],
            })(<Input disabled={!editable} addonAfter="万元" placeholder="产品额度(万元)"/>)}
          </FormItem>
        ),
        (
          <FormItem label="认购编号" required>
            {getFieldDecorator('code', {
              initialValue: data ? data.code : new Date().getTime().toString(16).toUpperCase(),
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled/>)}
          </FormItem>
         ),
        )}
        {createFormRow(
          (
            <FormItem label="分配方案名称" extra={loadingTip(allocationsTip)}>
              {getFieldDecorator('allocationId', {
                initialValue: data ? `${data.allocationId}` : null,
                rules: [
                  {
                    required: true,
                    message: '选择分配方案名称',
                  },
                ],
              })(<Select disabled={!editable} placeholder="选择分配方案" onChange={ value => this.handleAllocationChange(value)} >
                  {allocations.map(item => (
                    <Option key={`${item.id}`}>{item.name}</Option>
                  ))}
                </Select>)}
            </FormItem>),
          (
            <FormItem label="起息-到期日">
              {getFieldDecorator('duration', {
                initialValue: data ? [
                    moment(data.allocation.startDate, dateFormat),
                    moment(data.allocation.endDate, dateFormat),
                  ] : null,
                rules: [{
                  required: true,
                  message: '起息-到期日',
                }],
              })(<RangePicker style={{ width: '100%' }} disabled />)}
            </FormItem>),
          (
            <FormItem label="业绩比较基准">
              {getFieldDecorator('rate', {
                initialValue: data ? data.allocation.rate : null,
                rules: [{
                  required: true,
                  message: ' 输入业绩比较基准',
                }],
              })(<Input disabled addonAfter="%" placeholder="输入业绩比较基准" />)}
            </FormItem>))
        }
        {createFormRow(
          (
            <FormItem label="合同签订时间">
              {getFieldDecorator('signDate', {
                initialValue: data ? moment(data.signDate, dateFormat) : null,
                rules: [{
                  required: true,
                  message: '选择签订日期',
                }],
              })(<DatePicker
                disabled={!editable}
                style={{ width: '100%' }}
                format={dateFormat}
              />)}
            </FormItem>
          ),
          (
            <FormItem label="项目名称" extra={loadingTip(projectOptionTip)}>
              {getFieldDecorator('projectName', {
                initialValue: data ? data.projectName : null,
                rules: [{
                  required: true,
                  message: '输入项目名称',
                }],
              })(<Input disabled placeholder="输入项目名称" />)}
            </FormItem>
          ))
        }
      </Card>
    );
  }
}

export default BasicInfoCard;
