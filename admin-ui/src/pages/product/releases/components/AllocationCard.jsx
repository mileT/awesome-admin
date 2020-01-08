import React, { PureComponent } from 'react';
import { Card, Input, DatePicker } from 'antd';
import TableForm from '@/components/TableForm';
import Constant from '@/pages/Constant';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { dateFormat } = Constant;


const columns = tableForm => ([
  {
    title: '方案名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <Input
            value={text}
            autoFocus
            onChange={e => tableForm.handleFieldChange(e, 'name', index)}
            // onKeyPress={e => this.handleKeyPress(e, index)}
            placeholder="名称"
          />
        );
      }
      return text;
    },
  },
  {
    title: '认购下限',
    dataIndex: 'lowerLimit',
    key: 'lowerLimit',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <Input
            value={text || '' }
            autoFocus
            addonAfter="万元"
            onChange={e => tableForm.handleFieldChange(e, 'lowerLimit', index)}
            // onKeyPress={e => this.handleKeyPress(e, index)}
            placeholder="认购下限"
          />
        );
      }
      return `${text}万元`;
    },
  },
  {
    title: '认购上限',
    dataIndex: 'upperLimit',
    key: 'upperLimit',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <Input
            value={text || '' }
            addonAfter="万元"
            autoFocus
            onChange={e => tableForm.handleFieldChange(e, 'upperLimit', index)}
            // onKeyPress={e => this.handleKeyPress(e, index)}
            placeholder="认购上限(选填)"
          />
        );
      }
      return !text ? '' : `${text}万元`;
    },
  },
  {
    title: '起息-到期日',
    dataIndex: 'duration',
    key: 'duration',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <RangePicker
            defaultValue={text}
            onChange={e => tableForm.handleFieldChange(e, 'duration', index)}
            // onKeyPress={e => this.handleKeyPress(e, index)}
            format={dateFormat}
          />
        );
      }
      return `${text[0].format(dateFormat)}-${text[1].format(dateFormat)}`;
    },
  },
  {
    title: '预期收益率(%)',
    dataIndex: 'rate',
    key: 'rate',
    render: (text, record, index) => {
      if (record.editable) {
        return (
          <Input
            value={text}
            addonAfter="%"
            onChange={e => tableForm.handleFieldChange(e, 'rate', index)}
            placeholder="预期收益率(%)"
          />
        );
      }

      return `${text}`;
    },
  },
]);

class AllocationCard extends PureComponent {
  validateData = target =>
    (target && target.name && target.duration && target.rate && target.lowerLimit);

  render() {
    const { form: { getFieldDecorator }, data, editable } = this.props;
    const tableData = data ? data.map(item => ({
      ...item,
      duration: [moment(item.startDate, dateFormat), moment(item.endDate, dateFormat)],
    })) : [];

    return (
      <Card bordered={false} title="分配方案">
        {getFieldDecorator('allocations', {
          initialValue: tableData,
          rules: [
            {
              required: true,
              message: '请创建分配方案',
            },
          ],
        })(<TableForm disabled={ !editable } columns={columns} validateData={this.validateData}/>)}
      </Card>
    );
  }
}
export default AllocationCard;
