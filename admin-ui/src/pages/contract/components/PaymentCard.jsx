
import React, { PureComponent } from 'react';
import { Card, Input, DatePicker, Select, notification } from 'antd';
import moment from 'moment';
import TableForm from '@/components/TableForm';
import Constant from '@/pages/Constant';
import dictionary from '@/pages/Dictionary';
import { queryPayments } from '../service';

const { dateFormat } = Constant;
const { contract: { paidType } } = dictionary;


const columns = tableForm => ([
  {
    title: '缴费金额(万元)',
    dataIndex: 'paid',
    width: '25%',
    key: 'paid',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <Input
            addonAfter="万元"
            onChange={e => tableForm.handleFieldChange(e, 'paid', index)}
            value={text}
            placeholder="缴款金额" />
        );
      }
      return `${text}万元`;
    },
  },
  {
    title: '到账日',
    dataIndex: 'paidDate',
    width: '25%',
    key: 'paidDate',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <DatePicker
            style={{ width: '100%' }}
            value={text}
            format={dateFormat}
            onChange={e => tableForm.handleFieldChange(e, 'paidDate', index)}
          />
        );
      }
      return text.format(dateFormat);
    },
  },
  {
    title: '到账方式',
    dataIndex: 'paidType',
    width: '20%',
    key: 'paidType',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <Select
            value={record.paidType}
            paidDate
            onChange={e => tableForm.handleFieldChange(e, 'paidType', index)}
            placeholder="请选择收款方式">
            <Select.Option
              key={paidType.pos.val}
              value={paidType.pos.val}
            >
              {paidType.pos.text}
            </Select.Option>
            <Select.Option
              key={paidType.bank.val}
              value={paidType.bank.val}
            >
              {paidType.bank.text}
            </Select.Option>
            <Select.Option
              key={paidType.promissory.val}
              value={paidType.promissory.val}
            >
              {paidType.promissory.text}
            </Select.Option>
            <Select.Option
              key={paidType.accumulation.val}
              value={paidType.accumulation.val}
            >
              {paidType.accumulation.text}
            </Select.Option>
            <Select.Option
              key={paidType.else.val}
              value={paidType.else.val}
            >
              {paidType.else.text}
            </Select.Option>
          </Select>
        );
      }
      return Object.values(paidType).find(type => type.val === text).text;
    },
  },
]);

class PaymentCard extends PureComponent {
  componentDidMount() {
    const { form, data } = this.props;
    if (data) {
      queryPayments(data.id).then(resp => {
        if (resp.info && resp.info.val === 2001) {
          const payments = resp.data.map(item => ({
            ...item,
            paidDate: moment(item.paidDate, dateFormat),
            paidType: item.paidType.val,
          }))
          form.setFieldsValue({
            payments,
          })
          return;
        }
        notification.open({
          message: '获取付款信息失败，请稍后重试',
          duration: 5,
        })
      })
    }
  }

  render() {
    const { form: { getFieldDecorator }, editable } = this.props;
    return (
      <Card bordered={false} title="缴款信息">
        {getFieldDecorator('payments', {
          rules: [
            {
              required: true,
              message: '请创建缴款',
            },
          ],
          initialValue: [],
        })(<TableForm columns={columns} disabled={!editable} />)}
      </Card>
    );
  }
}

export default PaymentCard;
