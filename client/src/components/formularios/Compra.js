import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Tooltip,
} from 'antd';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import styles from './compra.module.css';

dayjs.extend(customParseFormat);
const dateFormatList = ['MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY'];
const { TextArea } = Input;

const Compra = ({ onClose }) => {
  const [isReposicion, setIsReposicion] = useState(true);
  const [stockReposicion, setStockReposicion] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [nroSerial, setNroSerial] = useState('');

  const [form] = Form.useForm();

  useEffect(() => {
    const getStockReposicion = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API + 'stock/stockReposicion'
        );
        if (response.data.ok)
          setStockReposicion([...response.data.stockReposicion]);
        else {
          throw new Error(response.data.errorMsg);
        }
      } catch (err) {
        console.log('ERROR -> ', err.message);
        setErrorMsg(err.message);
      }
    };

    getStockReposicion();
  }, [form]);

  const handleFormError = (error) => {
    console.log('FORM ERROR', error);

    setErrorMsg('Please enter required fields');
  };

  const handleSubmit = async (formInput) => {
    try {
      if (
        !formInput.nroStock ||
        !formInput.nroLote ||
        !formInput.fecha ||
        !formInput.pesoEntrada ||
        !formInput.precio
      ) {
        throw new Error('Please enter required fields');
      }

      const response = await axios.post(
        process.env.REACT_APP_API + 'stock/compra',
        formInput
      );

      if (response.data.ok) onClose(true);
      else throw new Error(response.data.errorMsg);
    } catch (err) {
      console.log('ERROR -> ', err);
      setErrorMsg(err.message);
      return false;
    }
  };

  const handleChange = (name, value) => {
    setErrorMsg('');

    let nroSerial = '';
    const nroStock = form.getFieldValue('nroStock');
    const nroLote = form.getFieldValue('nroLote');

    console.log(nroStock, nroLote);

    if (nroStock && nroLote) {
      nroSerial = nroStock.toString().trim() + '-' + nroLote.toString().trim();
      setNroSerial(nroSerial);
    }
  };

  return (
    <div className={styles.form}>
      <h2>
        Entry Form <br />
        {nroSerial}
      </h2>
      {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
      <Form
        form={form}
        name="compraForm"
        layout="horizontal"
        labelCol={{ span: 9 }}
        labelAlign="left"
        wrapperCol={{ offset: 0 }}
        requiredMark={false}
        onFinish={handleSubmit}
        onFinishFailed={handleFormError}
        initialValues={{
          fecha: dayjs(),
          nroStock: 0,
          nroLote: 0,
          pesoEntrada: 0,
          unidadPeso: 'kg',
          precio: 0,
          stockReposicion: '',
          tipoStock: '',
        }}
      >
        <Form.Item
          label="Cattle Type"
          name="tipoStock"
          rules={[{ required: true, message: 'Please Select a Cattle Type' }]}
          help={''}
        >
          <Select
            onChange={(value) => {
              handleChange('tipoStock', value);
            }}
            options={[
              {
                value: '',
                label: '-------',
              },
              ...[
                'Vacas de Ordeño',
                'Vacas Cria',
                'Vacas Paridas',
                'Vacas Escoteras',
                'Crias Hembras',
                'Crias Machos',
                'Novillas de Viente',
                'Hembras de Levante',
                'Machos de Levante',
                'Machos de Ceba',
                'Toretes',
                'Toros',
                'Otro',
              ].map((tipo) => ({
                key: `${tipo}`,
                value: `${tipo}`,
                label: `${tipo}`,
              })),
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Date Purchased"
          name="fecha"
          rules={[
            { required: true, message: 'Please specify the purchase date' },
          ]}
          help={''}
        >
          <DatePicker
            format={dateFormatList}
            onChange={(date, dateString) => {
              handleChange('fecha', dayjs(date, dateFormatList[0]));
            }}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="Cattle Number"
          name="nroStock"
          rules={[
            {
              required: true,
              message: 'Please enter Cattle Number',
            },
          ]}
          help={''}
        >
          <Input
            style={{ width: '100%' }}
            onChange={(value) => {
              handleChange('nroStock', value);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Batch Number"
          name="nroLote"
          rules={[
            { required: true, message: '' },
            {
              type: 'integer',
              min: 1,
              message: '',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            onChange={(value) => {
              handleChange('nroLote', value);
            }}
            step={1}
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="Weight"
          name="pesoEntrada"
          rules={[
            { required: true, message: '' },
            {
              type: 'number',
              min: 0.5,
              message: '',
            },
          ]}
        >
          <InputNumber
            onChange={(value) => {
              handleChange('pesoEntrada', value);
            }}
            style={{ width: '100%' }}
            step={1}
            min={1}
            addonAfter={
              <Select
                name="unidadPeso"
                defaultValue="kg"
                onChange={(value) => {
                  handleChange('unidadPeso', value);
                }}
                options={[
                  {
                    value: 'kg',
                    label: 'Kgs',
                  },
                  {
                    value: 'lb',
                    label: 'Lbs',
                  },
                  {
                    value: 'grm',
                    label: 'Grms',
                  },
                ]}
              />
            }
          />
        </Form.Item>
        <Form.Item
          label="Price per Weight"
          name="precio"
          rules={[
            { required: true, message: 'Please enter the price per weight' },
            {
              type: 'number',
              min: 0.1,
              message: '',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            onChange={(value) => {
              handleChange('precio', value);
            }}
            min={0}
            step={0.1}
            addonBefore={' $ '}
          />
        </Form.Item>

        <Form.Item name="stockReposicion" label="Replenishment?">
          <Select
            placeholder={'Cattle Number'}
            showSearch
            optionFilterProp="children"
            onChange={(value) => {
              handleChange('stockReposicion', value);
            }}
            disabled={isReposicion && stockReposicion.length ? false : true}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: '',
                label: '-------',
              },
              ...stockReposicion.map((stock) => ({
                key: `${stock._id}`,
                value: `${stock._id}`,
                label: `${stock.serialNro}`,
              })),
            ]}
          />
        </Form.Item>

        <Form.Item label="Notes" name="notas">
          <TextArea rows={4}></TextArea>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: '20px', width: '100%' }}
          >
            Save
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onClose} style={{ width: '100%' }}>
            Close
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Compra;
