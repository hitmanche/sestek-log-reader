import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { EventHelper } from '../../common/globalExtensions';

const LogJson = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [text, setText] = useState('');

  const triggerModal = () => {
    setIsModalVisible((old) => !old);
  };

  const syntaxHighlight = (json: string) => {
    json = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  const JsonControl = (data: string): boolean => {
    try {
      JSON.parse(data);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    EventHelper.subscribe('logJson', (textData: Array<string>) => {
      let readyText = '';
      if (textData.length > 0) {
        textData.forEach((textObj: string) => {
          readyText += JsonControl(textObj)
            ? `<pre>${syntaxHighlight(
                JSON.stringify(JSON.parse(textObj), undefined, 4)
              )}</pre>`
            : `${textObj}<br />`;
        });
      }
      setText(readyText);
      triggerModal();
    });

    return () => {
      EventHelper.unsubscribe('logJson');
    };
  }, []);

  return (
    <div>
      <Modal
        title="Log Detayı"
        visible={isModalVisible}
        width="70%"
        onCancel={triggerModal}
        cancelText="Kapat"
        okText="Tamam"
        onOk={triggerModal}
      >
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </Modal>
    </div>
  );
};

export default LogJson;
