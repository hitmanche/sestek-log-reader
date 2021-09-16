import { Table } from 'antd';
import React, { FunctionComponent } from 'react';

interface TableMemoProps {
  columns: Array<any>;
  dataLog: Array<any>;
}

const TableMemo: FunctionComponent<TableMemoProps> = (props) => {
  return (
    <>
      <Table
        pagination={{ position: ['topLeft'], pageSize: 20 }}
        columns={props.columns}
        size="small"
        onRow={(data: any) => {
          const query = document.querySelector(
            `[id="${data?.id}"]`
          ) as HTMLElement;

          if (query && data?.date) {
            const rowDate = new Date(data.date);
            if (
              new Date() <
              new Date(rowDate.setMinutes(rowDate.getMinutes() + 5))
            ) {
              const intervalControlForColorGrid = setInterval(() => {
                if (query.style.backgroundColor === '')
                  query.style.backgroundColor = '#ACD1AF';
                else query.style.backgroundColor = '';
              }, 500);

              setTimeout(() => {
                clearInterval(intervalControlForColorGrid);
                query.style.backgroundColor = '';
              }, 15000);
            } else {
              query.style.backgroundColor = '';
            }
          }
          return data;
        }}
        bordered
        dataSource={JSON.parse(JSON.stringify(props.dataLog)).reverse()}
      />
    </>
  );
};

export default React.memo(TableMemo);
