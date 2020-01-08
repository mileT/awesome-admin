import React, { PureComponent } from 'react';
import { Card, Form, Col, Row } from 'antd';
import ExtendTextArea from '@/components/ExtendTextArea';
import Constant from '@/pages/Constant';
import OssUpload from '@/components/OssUpload';
import { queryIntroductionUploadPolicy, queryFileLink } from '../service';

const FormItem = Form.Item;
const { defaultFormItemLayout: formLayout } = Constant;

class IntroductionCard extends PureComponent {
  state = {
    introductionUploadPolicy: {},
  }

  componentDidMount() {
    queryIntroductionUploadPolicy().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          introductionUploadPolicy: resp.data,
        });
      }
    });
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
  )

  render() {
    const { form: { getFieldDecorator }, data, editable } = this.props;
    const { introductionUploadPolicy } = this.state;
    const fileList = data && data.introductionMaterials ?
      {
        fileList: data.introductionMaterials.map(item => ({ ...item, uid: item.id, status: 'done' })),
      } : null;
    return (
      <Card bordered={false} title="推介信息">
        <Row>
          <Col lg={24} md={24} sm={24}>
           <FormItem label={editable ? '产品介绍' : '产品介绍(只读)' } style={{ marginBottom: 24 }}>
            {getFieldDecorator('content', {
              initialValue: data && data.introduction ? data.introduction.content : null,
              rules: [
                {
                  required: false,
                  message: '请输入产品介绍',
                },
              ],
            })(
              <ExtendTextArea onChange={() => {}} readOnly={!editable}
                style={{ paddingBottom: 48, height: 350, width: '100%' }}
              />)
            }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={24}>
            <FormItem {...formLayout} label="推介材料:">
              {getFieldDecorator('introductionMaterials', {
                initialValue: fileList,
              })(
                <OssUpload
                  link={queryFileLink}
                  editable={editable}
                  policy={introductionUploadPolicy}
                  style={{ width: 500 }} />)}
            </FormItem>
          </Col>
         </Row>
      </Card>
    );
  }
}
export default IntroductionCard;
