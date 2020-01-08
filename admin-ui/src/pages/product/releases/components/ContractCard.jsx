import React, { PureComponent } from 'react';
import { Card, Form, Col, Row } from 'antd';
import Constant from '@/pages/Constant';
import OssUpload from '@/components/OssUpload';
import { queryContractUploadPolicy, queryFileLink } from '../service';


const FormItem = Form.Item;
const { defaultFormItemLayout: formLayout } = Constant;

class ContractCard extends PureComponent {
  state = {
    contractUploadPolicy: {},
  }

  componentDidMount() {
    queryContractUploadPolicy().then(resp => {
      if (resp.info && resp.info.val === 2001) {
        this.setState({
          contractUploadPolicy: resp.data,
        });
      }
    });
  }

  render() {
    const { form: { getFieldDecorator }, data, editable } = this.props;
    const { contractUploadPolicy } = this.state;
    const fileList = data ?
      {
        fileList: data.map(item => ({ ...item, uid: item.id, status: 'done' })),
      } : null;
    return (
      <Card bordered={false} title="合同范本">
        <Row>
          <Col lg={12} md={12} sm={24}>
            <FormItem {...formLayout} label="合同附件:">
              {getFieldDecorator('contractMaterials', {
                initialValue: fileList,
                rules: [
                  {
                    required: true,
                    message: '请上传合同范本，便于线上用户查看',
                  },
                ],
              })(
                <OssUpload
                  policy={contractUploadPolicy}
                  editable={editable}
                  link={queryFileLink}
                  style={{ width: 500 }} />)}
            </FormItem>
          </Col>
        </Row>
      </Card>
    );
  }
}
export default ContractCard;
