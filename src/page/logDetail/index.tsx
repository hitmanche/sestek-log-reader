import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
import { Tag, Input, Space, Button, Tooltip } from 'antd';
import { History } from 'history';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import {
  SearchOutlined,
  BackwardOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { EventHelper } from '../../common/globalExtensions';
import LogJson from './logJson';
import TableMemo from './tableMemo';

interface DataLogType {
  id?: number;
  date?: string;
  type?: string;
  text?: string;
  json?: Array<string>;
  jsonIndex?: number;
}
interface LogDetailProps {
  fileName: string;
  history: History;
}

const LogDetail: FunctionComponent<LogDetailProps> = (props) => {
  moment.locale('tr');

  const fileName = props.history.location.state?.filename;

  const loadDataLog = () => {
    const arrayData = new Array<DataLogType>();
    if (Array.isArray(props.history.location.state?.textByLine)) {
      let indexOfState = -1;
      props?.history?.location?.state?.textByLine.forEach((text: string) => {
        const resDate = text.match(
          /\d{4}([\/ ])\d{2}([\/ ])\d{2}([\/ ])\d{2}([\/:])\d{2}([\/:])\d{2}/g
        );
        if (resDate) {
          indexOfState += 1;
          const start = resDate.toString().replace(/ /g, '-').substr(0, 10);
          const end = resDate.toString().substr(11, 10);
          const dating = `${start}T${end}`;

          const typing = text.match(/([\/\[])\D{3}([\/\]])/g);
          let texting = '';
          if (text.length > 37) {
            texting = text.substr(37, text.length - 37);
          }
          arrayData.push({
            id: arrayData.length + 1,
            date: dating,
            type:
              Array.isArray(typing) && typing.length > 0 ? typing[0] : '[NFD]',
            text: texting,
            jsonIndex: -1,
            json: new Array<string>(),
          });
        } else if (!arrayData[indexOfState]) {
          arrayData.push({ text });
        } else if (text && arrayData[indexOfState]) {
          arrayData[indexOfState].jsonIndex = indexOfState;
          arrayData[indexOfState].json?.push(text);
        }
      });
    }
    return arrayData;
  };

  const [dataLog, setDataLog] = useState(loadDataLog());

  const [searchedColumn, setSearchedColumn] = useState('');
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef();

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Ara
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrele
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput?.current?.select(), 100);
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Tarih',
      dataIndex: 'date',
      ...getColumnSearchProps('date'),
      width: 180,
      render: (date: string) => {
        return moment(date).format('LLL');
      },
    },
    {
      title: 'Tip',
      dataIndex: 'type',
      ...getColumnSearchProps('type'),
      render: (tag: string) => {
        let color = 'cyan';
        switch (tag) {
          case '[INF]':
            color = 'blue';
            break;
          case '[VRB]':
            color = 'orange';
            break;
          case '[ERR]':
            color = 'red';
            break;
          case '[WRN]':
            color = '#ff9966';
            break;
          default:
            break;
        }
        return (
          <Tag color={color} key={tag}>
            {tag?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Veri',
      dataIndex: 'jsonIndex',
      render: (index: number) => {
        if (index > -1) {
          return (
            <Tag
              style={{ cursor: 'pointer' }}
              color="green"
              onClick={() =>
                EventHelper.dispatch('logJson', dataLog[index].json)
              }
            >
              Veriyi Gör (Tıkla)
            </Tag>
          );
        }
        return null;
      },
    },
    {
      title: 'Açıklama',
      dataIndex: 'text',
      ...getColumnSearchProps('text'),
      render: (text: string) => {
        if (text?.length > 250) {
          //  return `${text.substring(0, 247)}...`;
          return (
            <Tooltip title={text} color="orange" placement="bottomLeft">
              <div>{`${text.substring(0, 247)}...`}</div>
            </Tooltip>
          );
        }
        return text;
      },
    },
  ];

  return (
    <div style={{ padding: 10 }}>
      <LogJson />
      <Button
        icon={<BackwardOutlined />}
        onClick={() => props.history.push('/')}
      >
        Geri Dön
      </Button>
      <Tag style={{ marginLeft: 20 }} color="green" icon={<FileOutlined />}>
        {fileName}
      </Tag>
      <TableMemo columns={columns} dataLog={dataLog} />
    </div>
  );
};

export default LogDetail;
