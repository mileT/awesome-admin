import { Button, Divider, Input, Popconfirm, Table, DatePicker, message } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import isEqual from 'lodash.isequal';
import styles from '../style.less';
import Constant from '@/pages/Constant';

const { RangePicker } = DatePicker;
const { dateFormat } = Constant;


class TableForm extends PureComponent {
  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  clickedCancel = false;

  index = 0;

  cacheOriginData = {};

  columns = [
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
              onChange={e => this.handleFieldChange(e, 'name', index)}
              onKeyPress={e => this.handleKeyPress(e, index)}
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
              onChange={e => this.handleFieldChange(e, 'lowerLimit', index)}
              onKeyPress={e => this.handleKeyPress(e, index)}
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
              onChange={e => this.handleFieldChange(e, 'upperLimit', index)}
              onKeyPress={e => this.handleKeyPress(e, index)}
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
              onChange={e => this.handleFieldChange(e, 'duration', index)}
              onKeyPress={e => this.handleKeyPress(e, index)}
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
              onChange={e => this.handleFieldChange(e, 'rate', index)}
              onKeyPress={e => this.handleKeyPress(e, index)}
              placeholder="预期收益率(%)"
            />
          );
        }

        return `${text}%`;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => {
        const { loading } = this.state;

        if (!!record.editable && loading) {
          return null;
        }

        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, index)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(index)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }

          return (
            <span>
              <a onClick={e => this.saveRow(e, index)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, index)}>取消</a>
            </span>
          );
        }

        return (
          <span>
            <a onClick={e => this.toggleEditable(e, index)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(index)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      value: props.value,
    };
    // this.columns = props.columns
  }

  getRowByKey(key, newData) {
    const { data = [] } = this.state;
    return (newData || data)[key];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);

    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }

      target.editable = !target.editable;
      this.setState({
        data: newData,
      });
    }
  };

  newMember = () => {
    const { data = [] } = this.state;
    const newData = data.map(item => ({ ...item }));
    this.index = data.length + 1;
    newData.push({
      key: this.index,
      editable: true,
      isNew: true,
    });
    this.setState({
      data: newData,
    });
  };

  remove(key) {
    const { data = [] } = this.state;
    const { onChange } = this.props;
    const newData = data.map(item => ({ ...item }))
    newData.splice(key, 1);
    this.setState({
      data: newData,
    });

    if (onChange) {
      onChange(newData);
    }
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data = [] } = this.state;
    const newData = [...data];
    const target = this.getRowByKey(key, newData);

    if (target) {
      target[fieldName] = e.target ? e.target.value : e;
      this.setState({
        data: newData,
      });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    const { validateData } = this.props;

    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }

      const target = this.getRowByKey(key) || {};

      if (validateData && !validateData(target)) {
        message.error('请填写完整信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      delete target.isNew;
      this.toggleEditable(e, key);
      const { data = [] } = this.state;
      const { onChange } = this.props;

      if (onChange) {
        onChange(data);
      }

      this.setState({
        loading: false,
      });
    }, 200);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data = [] } = this.state;
    const newData = [...data]; // 编辑前的原始数据

    let cacheOriginData = [];
    cacheOriginData = newData.map(item => {
      if (item.id === key) {
        if (this.cacheOriginData[key]) {
          const originItem = { ...item, ...this.cacheOriginData[key], editable: false };
          delete this.cacheOriginData[key];
          return originItem;
        }
      }

      return item;
    });
    this.setState({
      data: cacheOriginData,
    });
    this.clickedCancel = false;
  }

  render() {
    const { loading, data } = this.state;
    return (
      <Fragment>
        <Table
          rowKey={ item => item.id || item.key }
          loading={loading}
          columns={this.columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{
            width: '100%',
            marginTop: 16,
            marginBottom: 8,
          }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
