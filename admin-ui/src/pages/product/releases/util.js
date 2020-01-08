import React from 'react';
import {
  Badge,
} from 'antd';

const statusMap = ['default', 'processing', 'success', 'error'];

export const tableColumns = [
  {
    title: '编号',
    dataIndex: 'code',
  },
  {
    title: '项目名称(期))',
    dataIndex: 'projectName',
    render(text, record) {
      return record.issue ? `${text}(${record.issue})` : `${text}`;
    },
  },
  {
    title: '信披名称',
    dataIndex: 'publishName',
  },
  {
    title: '产品额度',
    dataIndex: 'quota',
    render: text => (`${text}万元`),
  },
  {
    title: '发行期',
    dataIndex: 'releasingStartDate',
    render(text, item) {
      return `${item.releasingStartDate}～${item.releasingEndDate}`
    },
  },
  {
    title: '起购金额',
    dataIndex: 'miniAmount',
    render: text => (`${text}万元`),
  },
  {
    title: '线上销售',
    dataIndex: 'online',
    render: text => (text ? '是' : '否'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: text => (<Badge status={statusMap[text.val]} text={text.msg} />),
  },
];

export const formProductDetail = (orgProduct, values, status, dateFormat) => {
  const basicInfo = {
    id: orgProduct.basicInfo.id,
    type: orgProduct.basicInfo.type.val,
    productId: orgProduct.basicInfo.id,
    preWorkflowId: values.preWorkflowId,
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
    crmId: orgProduct.crmId,
    status,
  }

  const allocations = values.allocations.map(item => ({
    ...item,
    productId: orgProduct.basicInfo.id,
    startDate: item.duration[0].format(dateFormat),
    endDate: item.duration[1].format(dateFormat),
  }))

  const introduction = {
    productId: orgProduct.basicInfo.id,
    content: values.content,
  }

  return {
    basicInfo,
    allocations,
    introduction,
    introductionMaterials:
      values.introductionMaterials ? values.introductionMaterials.fileList : null,
    contractMaterials: values.contractMaterials ? values.contractMaterials.fileList : null,
  };
}
