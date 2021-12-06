import React from 'react';
import Navbar from '../../components/NavBar/NavBar';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import './UpbloadBlocks.less';

export default function BlockUploader(props) {
  const uploadmanagement = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className='container nav-padding'>
      <Navbar />
      <div id='main-header'>Welcome Block Uploader</div>
      <div id='page-header'>
        <h1>Creating Blocks</h1>
      </div>
      <h3></h3>
      <Button>
        <a href='https://blockly-demo.appspot.com/static/demos/blockfactory/index.html'>
          Blockly Factory
        </a>
      </Button>
      <h3></h3>
      <Upload {...uploadmanagement}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </div>
  );
}
