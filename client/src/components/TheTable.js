import React, { useEffect, useState, useContext } from 'react';
import { Table, Modal, Button } from 'antd';

import {
  CheckSquareOutlined,
  ExclamationCircleFilled,
  DeleteOutlined,
} from '@ant-design/icons';

import styles from './TheTable.module.css';

import FilterContext from '../context/Filter.context';

const { confirm } = Modal;
const TheTable = ({ stocks, onDelete, onClick, onFilter, onClearFilter }) => {
  const { filterData, setFilterData, isFilterActive, clearFilterData } =
    useContext(FilterContext);

  const [selectedRows, setSelectedRows] = useState([]);

  const showConfirm = () => {
    confirm({
      title: 'Esta usted seguro?',
      icon: <ExclamationCircleFilled />,
      content: 'Se borraran todos los registros seleccinados',
      okText: 'Si',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
        onDelete(selectedRows);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    {
      title: 'Nro',
      dataIndex: 'stockNro',
      key: 'stockNro',
      render: (stockNro, record) => (
        <>
          <a onClick={() => handleDetails(record._id)}>{stockNro}</a>
        </>
      ),
    },
    {
      title: 'Lote',
      dataIndex: 'loteNro',
      key: 'loteNro',
    },
    {
      title: 'Fecha Compra',
      dataIndex: 'compra',
      key: 'fechaCompra',
      render: (compra) => <>{new Date(compra.fecha).toLocaleDateString()}</>,
    },
    {
      title: 'Precio Por Kg',
      dataIndex: 'compra',
      key: 'precioCompra',
      render: (compra) => <>{'$ ' + compra.precio.toFixed(2)}</>,
    },
    {
      title: 'Peso Compra',
      dataIndex: 'compra',
      key: 'pesoCompra',
      render: (compra) => <>{compra.peso ? compra.peso.peso + ' kgs' : ''}</>,
    },
    {
      title: 'Precio Total',
      dataIndex: 'compra',
      key: 'precioTotal',
      render: (compra) => (
        <>
          {' '}
          {'$ ' +
            (compra.peso ? compra.peso.peso * compra.precio : 0)
              .toFixed(2)
              .toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </>
      ),
    },
    {
      title: 'Ultimo Peso',
      dataIndex: 'pesos',
      key: 'pesos',
      render: (pesos, rows) => (
        <>{pesos.length ? pesos[0].peso + ' kgs' : ''}</>
      ),
    },
    {
      title: 'Vendido',
      dataIndex: 'venta',
      key: 'venta',
      render: (venta, rows) => {
        return (
          <>
            {venta && (
              <CheckSquareOutlined
                className={styles.vendido}
                style={{ color: rows.reposicion ? 'green' : 'orange' }}
              />
            )}
          </>
        );
      },
    },
  ];

  const handleDetails = (id) => {
    console.log({ theIDFromTheTable: id });

    onClick(id);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
      setSelectedRows(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  return (
    <>
      <div className={styles.table}>
        <div className={styles.header}>
          <div>
            {stocks.length > 0 && (
              <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}
                disabled={!selectedRows.length ? 'disabled' : ''}
                onClick={showConfirm}
              >
                Borrar
              </Button>
            )}
          </div>
          {isFilterActive() && (
            <div>
              <Button onClick={onClearFilter}>Borrar Filtro</Button>
            </div>
          )}

          <div>
            <Button onClick={() => onFilter('filter')}>Filtrar</Button>
          </div>
        </div>
        <Table
          columns={columns}
          rowKey={(record) => record._id}
          dataSource={stocks}
          pagination={false}
          rowSelection={{ ...rowSelection }}
        />
      </div>
    </>
  );
};

export default TheTable;
