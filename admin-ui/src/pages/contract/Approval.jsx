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
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import { queryAllContracts, updateContract, deleteContract, formUpdateModel } from './service';
import dictionary from '@/pages/Dictionary';
import ContractDetail from './ContractDetail';
import { response } from '@/utils/utils';
import styles from './style.less';

const FormItem = Form.Item;
const { contract: { status: contractStatus } } = dictionary;
const { Option } = Select;

const statusMap = ['default', 'processing', 'success', 'error'];

/* eslint react/no-multi-comp:0 */
class Approval extends Component {
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
      render: record => (
        <span>
          <a
            disabled={record.status.val !== contractStatus.waitingForReview.val}
            onClick={() => this.handleEdit(record)}>审批</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDetail(record)}>详情</a>
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
      response(resp, '删除', this.doSearch());
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

  doSearch = () => {
    const { form } = this.props;
    this.setState({
      loading: true,
      showContractDetail: false,
    })

    const formValues = form.getFieldsValue();
    const param = {
      status: formValues.status,
      page: this.pagination,
    }

    queryAllContracts(param).then(resp => {
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

  triggerEditable = () => {
    const { detailEditable } = this.state;
    this.setState({
      detailEditable: !detailEditable,
    });
  }

  handleDetailSubmit = (data, values) => {
    const params = formUpdateModel(data, values, contractStatus.released);
    updateContract(params).then(resp => {
      response(resp, '提交', this.doSearch())
    })
  }

  handleDetailRollback = (data, values) => {
    const params = formUpdateModel(data, values, contractStatus.waitingForSubmit);
    updateContract(params).then(resp => {
      response(resp, '撤回', this.doSearch())
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
                `${contractStatus.waitingForReview.val}`,
                `${contractStatus.released.val}`],
            })(
              <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
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
      rollback: this.handleDetailRollback,
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
                triggerEditable={this.triggerEditable}
              />
            </Card>
          )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Approval);
