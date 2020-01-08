import {
  Button,
  Badge,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  notification,
  Popconfirm,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import { queryContracts, updateContract, deleteContract, formUpdateModel } from './service';
import dictionary from '@/pages/Dictionary';
import ContractDetail from './ContractDetail';
import { response } from '@/utils/utils';
import styles from './style.less';

const FormItem = Form.Item;
const { contract: { status: contractStatus } } = dictionary;
const { Option } = Select;

const statusMap = ['default', 'processing', 'success', 'error'];

/* eslint react/no-multi-comp:0 */
class TableList extends Component {
  state = {
    selectedRows: [],
    list: [],
    loading: false,
    showContractDetail: false,
    detailEditable: false,
    selectedContract: null,
  };

  columns = [
    {
      title: '认购编号',
      dataIndex: 'code',
    },
    {
      title: '受益人',
      dataIndex: 'beneficiary',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
    },
    {
      title: '购买金额(万元)',
      dataIndex: 'amount',
    },
    {
      title: '起息-到期日',
      dataIndex: 'allocation',
      render(text) {
        return `${text.startDate}~${text.endDate}`;
      },
    },
    {
      title: '利率(%)',
      dataIndex: 'allocation.rate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        return (<Badge status={statusMap[text.val]} text={text.msg} />);
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleDetail(record)}>详情</a>
          <Divider type="vertical" />
          <a
            disabled={record.status.val !== contractStatus.waitingForSubmit.val}
            onClick={() => this.handleEdit(record)}>提交审批</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" okText="确认" cancaelText="取消" onConfirm={() => this.handleDelete(record.id)}>
            <a
              disabled={
                record.status.val !== contractStatus.waitingForSubmit.val}
            >
              删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  DetailButtons = {
    cancel: {},
    save: {},
    submit: {},
  };

  pagination = {
    current: 1,
    pageSize: 10,
    totalCount: 0,
  }

  componentDidMount() {
    this.doSearch();
  }

  triggerDetailCard = () => {
    const { showContractDetail } = this.state;
    this.setState({
      showContractDetail: !showContractDetail,
    });
  }

  handleDetail = record => {
    this.setState({
      showContractDetail: true,
      detailEditable: false,
      selectedContract: record,
    });
  }

  handleEdit = record => {
    this.setState({
      showContractDetail: true,
      detailEditable: true,
      selectedContract: record,
    })
  }

  handleDelete = id => {
    deleteContract(id).then(resp => {
      response(resp, '删除', this.doSearch);
    });
  }

  handleStandardTableChange = pagination => {
    this.pagination = pagination;
    this.doSearch();
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.doSearch();
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.doSearch();
  };

  handleRefresh = () => {
    this.setState({
      selectedRows: [],
    })
    this.doSearch();
  }

  triggerEditable = () => {
    const { detailEditable } = this.state;
    this.setState({
      detailEditable: !detailEditable,
    });
  }

  doSearch = () => {
    const { form } = this.props;
    const formValues = form.getFieldsValue();
    const param = {
      status: formValues.status,
      page: this.pagination,
    }

    this.setState({
      loading: true,
      showContractDetail: false,
    })
    queryContracts(param).then(resp => {
      this.setState({ loading: false })
      if (resp.info && resp.info.val === 2001) {
        notification.open({
          message: '列表获取成功',
          duration: 1,
        });
        this.setState({
          list: resp,
        })
      } else {
        notification.open({
          message: '列表获取失败',
          description: resp.info ? resp.info.msg : '',
          duration: 4,
        });
        this.setState({
          list: [],
        })
      }
    });
  }

  handleDetailSubmit = (data, values) => {
    const params = formUpdateModel(data, values, contractStatus.waitingForReview);
    updateContract(params).then(resp => {
      response(resp, '提交', this.doSearch)
    })
  }

  handleDetailSave = (data, values) => {
    const params = formUpdateModel(data, values, data.status);
    updateContract(params).then(resp => {
      response(resp, '保存', this.doSearch)
    })
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="发行状态"> {getFieldDecorator('status', {
              initialValue: [
                `${contractStatus.waitingForSubmit.val}`,
                `${contractStatus.waitingForReview.val}`,
                `${contractStatus.released.val}`],
            })(
              <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                <Option key={contractStatus.waitingForSubmit.val}>
                  {contractStatus.waitingForSubmit.text}
                </Option>
                <Option key={contractStatus.waitingForReview.val}>
                  {contractStatus.waitingForReview.text}
                </Option>
                <Option key={contractStatus.released.val}>
                  {contractStatus.released.text}
                </Option>
              </Select>,
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      selectedRows,
      list,
      loading,
      showContractDetail,
      detailEditable,
      selectedContract } = this.state;

    const footerButtons = detailEditable ? {
      submit: this.handleDetailSubmit,
      save: this.handleDetailSave,
      cancel: this.triggerDetailCard,
    } : {};

    return (
      <PageHeaderWrapper>
        {!showContractDetail ? (
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="sync" onClick={() => this.doSearch()}>
                  刷新
                </Button>
              </div>
              <StandardTable
                rowKey={item => item.id}
                selectedRows={selectedRows}
                loading={loading}
                body={list}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        ) : (
            <Card bordered={false} title={<a onClick={this.triggerDetailCard}>返回</a>} >
              <ContractDetail
                data={selectedContract}
                editable={detailEditable}
                footerButtons={footerButtons}
              />
            </Card>
          )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
