import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Input,
  Select,
  Divider,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import dictionary from '@/pages/Dictionary';
import ProductDetail from './ProductDetail';
import { formProductDetail, tableColumns } from './util';
import { queryProduct, updateProduct } from './service';
import { response } from '@/utils/utils';
import constant from '@/pages/Constant';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { product: { status: productStatus } } = dictionary;
const { dateFormat } = constant;

class TableList extends Component {
  state = {
    selectedRows: [],
    modalVisible: false,
    selectedItem: null,
    editable: false,
    products: {
      info: null,
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
    },
    loading: false,
  };

  columns = [
    ...tableColumns,
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={e => this.handleDetail(e, record)}>详情</a>
          <Divider type="vertical" />
          <a
            disabled={record.status.val !== productStatus.waitingForReview.val}
            onClick={e => this.handleDetailSubmit(e, record)}
          >审批</a>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.doSearch();
  }

  handleStandardTableChange = pagination => {
    this.doSearch(pagination);
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

  doSearch = pagination => {
    const { form } = this.props;
    const { products } = this.state;
    const page = pagination || products.pagination;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pagination: page,
      };
      this.setState({
        loading: true,
      });
      queryProduct(values).then(resp => {
        response(resp, '获取列表',
          () => {
            this.setState({
              loading: false,
              products: resp,
            });
          },
          () => {
            this.setState({
              loading: false,
            })
          },
        );
      });
    });
  }

  triggerModalVisibel = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  }

  handleUpdateDetail = (orgProduct, changedValues, changedStatus, action) => {
    updateProduct(
      formProductDetail(orgProduct, changedValues, changedStatus.val, dateFormat))
      .then(resp => {
        response(resp, action, this.refreshList);
      })
  }

  refreshList = () => {
    this.setState({
      modalVisible: false,
    });
    this.doSearch();
  }

  handleDetail = (e, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      selectedItem: record,
      editable: false,
    });
  }

  handleDetailSubmit = (e, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      selectedItem: record,
      editable: true,
    });
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="信披名称"> {getFieldDecorator('publishName')(
              <Input placeholder="输入信披名称" style={{ width: '100%' }} />,
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发行状态"> {getFieldDecorator('status', {
              initialValue: [
                `${productStatus.waitingForReview.val}`,
                `${productStatus.released.val}`],
            })(
              <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                <Option key={productStatus.waitingForReview.val}>
                  {productStatus.waitingForReview.text}
                </Option>
                <Option key={productStatus.released.val}>
                  {productStatus.released.text}
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
    const { selectedRows, modalVisible, selectedItem, editable, products, loading } = this.state;

    const parentMethods = {
      triggerModalVisibel: this.triggerModalVisibel,
      handleDetailSubmit: (orgProduct, changedValues) =>
        this.handleUpdateDetail(orgProduct, changedValues, productStatus.released, '提交'),
      handleDetailRollback: (orgProduct, changedValues) =>
        this.handleUpdateDetail(orgProduct, changedValues, productStatus.waitingForSubmit, '退回'),
    }

    return (
      <PageHeaderWrapper>
        {!modalVisible ? (
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              <div className={styles.tableListOperator}>
                <Button icon="sync" onClick={() => this.doSearch()}>
                  刷新
                </Button>
              </div>
              <StandardTable
                rowKey={item => (item.id)}
                selectedRows={selectedRows}
                loading={loading}
                body={products}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
        ) : (
            <ProductDetail {...parentMethods} data={selectedItem} mode="updating" editable={editable} canRollback />
          )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
