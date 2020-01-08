import { Alert, Table } from 'antd';
import React, { Component, Fragment } from 'react';
import styles from './index.less';

class StandardTable extends Component {
  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const currySelectedRowKeys = selectedRowKeys;

    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({
      selectedRowKeys: currySelectedRowKeys,
    });
  };

  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  showSelectedRowAlert = selectedRowKeys => (
    <Alert hidden="hidden"
      message={
        <Fragment>
          已选择{' '}<a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}项
          <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 16 }}>清空</a>
        </Fragment>
      }
      type="info" showIcon
    />
  )

  render() {
    const { selectedRowKeys } = this.state;
    const { body, rowKey, ...rest } = this.props;
    const { data = [], pagination = false } = body || {};
    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          {this.showSelectedRowAlert(selectedRowKeys)}
        </div>
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={data}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
