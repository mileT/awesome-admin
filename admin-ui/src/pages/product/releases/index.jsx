import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Input,
  Select,
  Popconfirm,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import dictionary from '@/pages/Dictionary';
import ProductDetail from './ProductDetail';
import { queryMyProduct, updateProduct, deleteProduct } from './service';
import { formProductDetail, tableColumns } from './util';
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
    detailEditable: false,
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
            disabled={record.status.val !== productStatus.waitingForSubmit.val}
            onClick={e => this.handleDetailSubmit(e, record)}
          >提交审批</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" okText="确认" cancaelText="取消" onConfirm={() => this.handelDelete(record.id)}>
            <a
              disabled={
                record.status.val !== productStatus.waitingForSubmit.val}
            >
              删除</a>
          </Popconfirm>
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
    const { products } = this.state
    const page = pagination || products.pagination;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pagination: page,
      };
      this.setState({
        loading: true,
      })
      queryMyProduct(values).then(resp => {
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
        )
      });
    });
  }

  triggerModalVisibel = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    });
  }

  handelDelete = id => {
    deleteProduct(id).then(resp => {
      response(resp, '删除', this.doSearch);
    })
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
      detailEditable: false,
      selectedItem: record,
    });
  }

  handleDetailSubmit = (e, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
      detailEditable: true,
      selectedItem: record,
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
                `${productStatus.waitingForSubmit.val}`,
                `${productStatus.waitingForReview.val}`,
                `${productStatus.released.val}`],
            })(
              <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                <Option key={productStatus.waitingForSubmit.val}>
                  {productStatus.waitingForSubmit.text}
                </Option>
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
    const { selectedRows, modalVisible, selectedItem, detailEditable, products, loading } = this.state;

    const parentMethods = {
      triggerModalVisibel: this.triggerModalVisibel,
      handleDetailSubmit: (orgProduct, changedValues) =>
        this.handleUpdateDetail(orgProduct, changedValues, productStatus.waitingForReview, '提交'),
      handleDetailSave: (orgProduct, changedValues) =>
        this.handleUpdateDetail(orgProduct, changedValues, orgProduct.basicInfo.status, '保存'),
    };

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
            <ProductDetail {...parentMethods} data={selectedItem} mode="updating" editable={detailEditable} />
          )}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
