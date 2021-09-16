import React, { useEffect, useState } from 'react';
import { message, Input, Divider, List, Typography } from 'antd';
import { readTextFile } from '../../common';

const fs = require('fs');
const path = require('path');

const LogFile = (props: any) => {
  // BURASI FILE PATH GELDIGINDE OKUMA ISLEMININ YAPILDI YER ##############
  // 'C:\\Users\\tayfu\\Desktop\\botconnector'
  const [filePath, setFilePath] = useState('');
  const [folderList, setFolderList] = useState(new Array<string>());
  const changeSetFilePath = (newData: string) => setFilePath(newData);
  const changeSetFolderList = (newData: Array<string>) =>
    setFolderList(newData);
  useEffect(() => {
    if (filePath) {
      const readData = fs.readdirSync(filePath, {});
      let fileControl = true;
      const fileList = new Array<string>();
      readData.forEach((file: string) => {
        if (path.extname(file) === '.txt') {
          fileControl = false;
          fileList.push(file);
        }
      });

      changeSetFolderList(fileList);
      if (fileControl) {
        message.warning('Klasörde .txt uzantılı bir dosya bulunamadı.');
      }
    }
  }, [filePath]);
  // BURASI FILE PATH GELDIGINDE OKUMA ISLEMININ YAPILDI YER ##############

  const onClickTest = () => {
    window.electron.dialog
      .showOpenDialog(window.electron.remote.getCurrentWindow(), {
        properties: ['openDirectory'],
      })
      .then((result: any) => {
        // eslint-disable-next-line promise/always-return
        if (Array.isArray(result.filePaths) && result.filePaths.length > 0) {
          const baseFile = result.filePaths[0];
          changeSetFilePath(baseFile);
        }
      })
      // eslint-disable-next-line no-console
      .catch((err: unknown) => console.error(err));
  };

  return (
    <div style={{ padding: 10 }}>
      <h1>Sestek Log Reader</h1>
      <Input.Search
        placeholder="Log Dosyaları Yolu"
        allowClear
        value={filePath}
        enterButton="Search"
        size="large"
        readOnly
        onSearch={onClickTest}
      />
      <br />
      <Divider orientation="left">Log Kayıtları</Divider>
      <List
        footer={<div>Log kaydını açmak için üstüne tıklayınız..</div>}
        bordered
        pagination={{
          pageSize: 100,
        }}
        dataSource={folderList.reverse()}
        renderItem={(item: string) => (
          <List.Item>
            <Typography.Text
              mark
              style={{ cursor: 'pointer' }}
              onClick={() =>
                readTextFile(`${filePath}/${item}`, (response: any) => {
                  console.log(response.getResponseHeader('Last-Modified'));
                  const textByLine = response.responseText.split('\n');
                  props.history.push({
                    pathname: '/logDetail',
                    state: {
                      textByLine,
                      filename: item,
                    },
                  });
                })
              }
            >
              {item}
            </Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default LogFile;
