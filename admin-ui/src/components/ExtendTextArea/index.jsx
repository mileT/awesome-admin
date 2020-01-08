import React, { PureComponent } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class ExtendTextArea extends PureComponent {
  render() {
    return (
      <ReactQuill {...this.props}>
        {this.children}
      </ReactQuill>
    );
  }
}

export default ExtendTextArea;
