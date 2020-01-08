import React, { PureComponent } from 'react';
import { Card, Form, Input, Col, Row, Select, DatePicker, Spin, Icon, Checkbox } from 'antd';
import moment from 'moment';
import { queryApplyWorkflow, queryProjects, queryBanks } from '../service';
import constant from '@/pages/Constant';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { dateFormat } = constant;


const loadingTip = tips => {
  const antIcon = <Icon type="loading" style={{ fontSize: 16 }} spin />
  if (tips && tips.loading) {
    return (<span><Spin indicator={antIcon} style={{ marginRight: 4 }} />{tips.msg}</span>);
  }
  return (<span style={{ color: '#f5222d' }}>{tips ? tips.msg : null}</span>);
}

class BasicInfoCard extends PureComponent {
  state = {
    workflowOptions: [],
    workflowOptionsTip: null,
    projectOptions: [],
    projectOptionsTip: null,
    bankOptions: [],
    bankOptionsTip: null,
  }

  cachedData = null;

  componentDidMount() {
    const { mode, data } = this.props;
    if (mode === 'updating') {
      this.cachedData = { ...data };
      this.setState({
        cardDisabled: true,
      })
    }
    const initialTip = {
      loading: true,
      msg: '正在加载选项...',
    };
    this.setState({
      projectOptionsTip: initialTip,
      workflowOptionsTip: initialTip,
    })

    this.renderWorkflowOptions();
    this.renderProjectOptions();
    this.renderBankOpions();
  }

  renderWorkflowOptions = () => {
    queryApplyWorkflow().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          workflowOptionsTip: null,
          workflowOptions: resp.data,
        })
        return;
      }
      this.setState({
        workflowOptionsTip: { msg: '获取信息失败' },
        workflowOptions: [],
      })
    })
  }

  renderProjectOptions = () => {
    queryProjects().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          projectOptionsTip: null,
          projectOptions: resp.data,
        })
        return;
      }
      this.setState({
        projectOptionsTip: { msg: '获取信息失败' },
        projectOptions: [],
      })
    });
  }

  renderBankOpions = () => {
    queryBanks().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          bankOptions: resp.data,
          bankOptionsTip: null,
        })
        return;
      }
      this.setState({
        bankOptions: [],
        bankOptionsTip: { msg: '获取信息失败' },
      });
    })
  }

  createFormRow = (component1, component2, component3) => (
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
  );

  render() {
    const { form: { getFieldDecorator }, editable, data } = this.props;
    const { projectOptions, projectOptionsTip, workflowOptions,
      workflowOptionsTip, bankOptions, bankOptionsTip } = this.state;
    return (
      <Card
        bordered={false}
        title="基础信息"
      >
        {this.createFormRow(
          (
            <FormItem label="申报流程" extra={loadingTip(workflowOptionsTip)}>
              {getFieldDecorator('preWorkflowId', {
                initialValue: data ? data.preWorkflowId : null,
                rules: [{
                  required: true,
                  message: '选择流程',
                }],
              })(<Select
                showSearch
                disabled={!editable}
                dropdownMatchSelectWidth={false}
                placeholder="请选择申报流程"
                filterOption={(input, option) =>
                  option.props.children.indexOf(input) >= 0
                }
              >
                {workflowOptions.map(item => (
                  <Option key={item.code}>{`${item.name}(${item.code})`}</Option>
                ))}
              </Select>)}
            </FormItem>
          ), (
          <FormItem label="项目名称" extra={loadingTip(projectOptionsTip)}>
            {getFieldDecorator('project', {
              initialValue: data ? { key: data.projectId, label: data.projectName } : { key: '' },
              rules: [{
                required: true,
                message: '请选择项目名称',
              }],
            })(<Select
              showSearch
              disabled={!editable}
              dropdownMatchSelectWidth={false}
              placeholder="请选择项目"
              labelInValue
              filterOption={(input, option) =>
                option.props.children.indexOf(input) >= 0
              }
            >
              {projectOptions.map(item => (
                <Option key={item.projectId}>{item.projectName}</Option>
              ))}
            </Select>)}
          </FormItem>
        ),
        (
          <FormItem label="产品编号">
            {getFieldDecorator('code', {
              initialValue: data ? data.code : null,
              rules: [{
                required: true,
                message: '请输入产品编号',
              }],
            })(<Input disabled={!editable} placeholder="请输入产品编号" />)}
          </FormItem>
        ))
        }
        {this.createFormRow(
          (
            <FormItem label="产品名称">
              {getFieldDecorator('publishName', {
                initialValue: data ? data.publishName : null,
                rules: [{
                  required: true,
                  message: '请输入产品名称',
                }],
              })(<Input disabled={!editable} placeholder="请输入产品名称" />)}
            </FormItem>
          ),
          (
            <FormItem label="产品期次">
              {getFieldDecorator('issue', {
                initialValue: data ? data.issue : null,
                rules: [{
                  required: false,
                  message: '请输入产品期次',
                }],
              })(<Input addonAfter="期" disabled={!editable} placeholder="请输入产品期次" />)}
            </FormItem>
          ),
          (
            <FormItem label="发行规模" required>
              {getFieldDecorator('quota', {
                initialValue: data ? data.quota : null,
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                    message: '请输入整数金额(万元), 无规模填0',
                  },
                ],
              })(<Input disabled={!editable} addonAfter="万元" placeholder="产品规模(万元)，无规模填0" />)}
            </FormItem>
          ))
        }
        {
          this.createFormRow(
            (
              <FormItem label="起购金额" required>
                {getFieldDecorator('miniAmount', {
                  initialValue: data ? data.miniAmount : null,
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9]\d*$/, 'g'),
                      message: '请输入整数金额(万元)',
                    },
                  ],
                })(<Input disabled={!editable} addonAfter="万元" placeholder="请输入起购金额(万元)" />)}
              </FormItem>
            ),
            (
              <FormItem label="发行阶段">
                {getFieldDecorator('releaseDuration', {
                  initialValue: data ?
                    [
                      moment(data.releasingStartDate, dateFormat),
                      moment(data.releasingEndDate, dateFormat),
                    ]
                    : null,
                  rules: [{
                    required: true,
                    message: '请选择发行阶段时间',
                  }],
                })(<RangePicker disabled={!editable} style={{ width: '100%' }} />)}
              </FormItem>
            ),
            (
            <FormItem label="缴款账户" required extra={loadingTip(bankOptionsTip)}>
              {getFieldDecorator('bankAccount', {
                initialValue: data ? data.bankAccount : null,
                rules: [
                  {
                    required: true,
                    message: '请选择账户',
                  },
                ],
              })(<Select disabled={!editable} placeholder="请选择缴款账户">
                {bankOptions.map(item => (
                <Option key={item.account}>{`${item.bank}(${item.account})`}</Option>
              ))}
              </Select>)}
            </FormItem>
          ),
        )
        }
        {this.createFormRow(
          (
            <FormItem label="是否挂网" required>
              {getFieldDecorator('online', {
                valuePropName: 'checked',
                initialValue: data ? data.online : true,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Checkbox disabled={!editable}>挂网</Checkbox>)}
            </FormItem>
          ),
        )
        }
      </Card>
    );
  }
}

export default BasicInfoCard;
