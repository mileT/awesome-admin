
import React, { PureComponent } from 'react';
import { Upload, Button, Icon, notification } from 'antd';
import isEqual from 'lodash.isequal';
import FileSaver from 'file-saver';

class OssUpload extends PureComponent {
  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      fileList: nextProps.value && nextProps.value.fileList ? nextProps.value.fileList : [],
    };
  }

  state = {
    fileList: [],
  }

  handleChange = info => {
    let changedfileList = [...info.fileList];

    const { policy: { dir }, onChange } = this.props;

    // 2. Read from response and show file link
    changedfileList = changedfileList.map(item => {
      return {
        uid: item.uid,
        name: item.name,
        status: item.status,
        path: `${dir}/${item.name}`,
        url: item.response ? item.response.url : null,
      };
    });

    this.setState({
      fileList: changedfileList,
    });

    if (onChange) {
      onChange({
        fileList: changedfileList,
      });
    }
  };

  handlePreview = file => {
    const { link } = this.props;
    if (link) {
      link(`${file.path}`).then(resp => {
        if (resp.info && resp.info.val === 2001) {
          FileSaver.saveAs(resp.data, file.name)
        }
      })
    } else if (file.url) {
      FileSaver.saveAs(file.url, file.name)
    }
  };

  beforeUpload = file => {
    const { policy } = this.props;
    const { fileList: originFileList } = this.state;
    if (!policy) {
      notification.open({
        message: '无法加载上传policy',
      })
    }
    const exist = originFileList.filter(item => item.name === file.name).length >= 1;
    return new Promise((resolve, reject) => {
      if (exist) {
        notification.open({
          message: '无法上传同名文件',
        })
        reject(file)
      } else {
        resolve(file);
      }
    });
  }

  render() {
    const { policy: { dir, host, accessId, policy, signature }, editable } = this.props;
    const { fileList } = this.state;

    const props = {
      action: host,
      onChange: this.handleChange,
      multiple: true,
    };
    return (
      <Upload {...props} beforeUpload={this.beforeUpload} fileList={fileList} onPreview={this.handlePreview} disabled={!editable}
        data={
          {
            key: `${dir}/\${filename}`,
            OSSAccessKeyId: accessId,
            policy,
            signature,
            success_action_status: 200,
          }
        }>
        <Button size="small" disabled={!editable}>
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    );
  }
}

export default OssUpload;
