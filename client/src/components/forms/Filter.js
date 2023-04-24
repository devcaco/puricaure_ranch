import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Form, Slider, Input, DatePicker, Select, Button } from 'antd';
import FilterContext from '../../context/Filter.context';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import styles from './Filter.module.css';

dayjs.extend(customParseFormat);

const dateFormatList = ['MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY'];

const { RangePicker } = DatePicker;

const Filter = ({ onClose }) => {
  const {
    filterData: formData,
    setFilterData: setFormData,
    setFilterSearch,
    filterSearch,
    clearFilterData,
    isFilterActive,
  } = useContext(FilterContext);

  const [form] = Form.useForm();

  const [loteNros, setLoteNros] = useState([]);

  useEffect(() => {
    const fetchLoteNros = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API + 'stock/loteNros'
        );

        if (response.data.ok) {
          setLoteNros(response.data.loteNros);
        } else throw new Error(response.data.errorMsg);
      } catch (err) {
        console.log('ERROR -> ', err);
      }
    };

    fetchLoteNros();
  }, []);

  const handleChange = (name, val) => {
    switch (name) {
      case 'buscar':
        setFilterSearch(val);
        break;
      case 'loteNro':
        setFormData((prevState) => ({ ...prevState, loteNro: val }));
        break;
      case 'vendido':
        setFormData((prevState) => ({ ...prevState, vendido: val }));
        break;
      case 'tipoStock':
        setFormData((prevState) => ({ ...prevState, tipoStock: val }));
        break;
      case 'fechaCompra':
        setFormData((prevState) => ({
          ...prevState,
          fechaCompra1: val && val[0] ? val[0] : '',
          fechaCompra2: val && val[1] ? val[1] : '',
        }));
        break;
      case 'fechaVenta':
        setFormData((prevState) => ({
          ...prevState,
          fechaVenta1: val && val[0] ? val[0] : '',
          fechaVenta2: val && val[0] ? val[0] : '',
        }));
        break;
      case 'peso':
        setFormData((prevState) => ({
          ...prevState,
          peso1: val[0],
          peso2: val[1],
        }));
        break;
      default:
        break;
    }
  };
  const handleSubmit = () => {
    onClose(false);
  };
  return (
    <section className={styles.filter}>
      <h2>Filter</h2>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 9 }}
        labelAlign="left"
        onFinish={handleSubmit}
        initialValues={{
          buscar: filterSearch,
          vendido: formData.vendido || '',
          loteNro: formData.loteNro || '',
          tipoStock: formData.tipoStock || '',
          fechaCompra: [formData.fechaCompra1, formData.fechaCompra2],
          fechaVenta: [formData.fechaVenta1, formData.fechaVenta2],
          peso: [formData.peso1, formData.peso2],
        }}
      >
        <Form.Item name="buscar" label="Search" className={styles.hidden}>
          <Input
            value={filterSearch}
            placeholder="Cattle Number"
            allowClear={true}
            // addonBefore={<SearchOutlined />}
            onChange={(e) => {
              setFilterSearch(e.target.value);
              // handleChange('buscar', e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item name="loteNro" label="Batch">
          <Select
            onChange={(val) => handleChange('loteNro', val)}
            value={formData.loteNro}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toString().includes(input)
            }
            options={[
              { value: '', label: '---------' },
              ...loteNros.map((lote) => ({
                key: lote,
                value: lote,
                label: lote,
              })),
            ]}
          />
        </Form.Item>

        <Form.Item label="Cattle Type" name="tipoStock">
          <Select
            onChange={(value) => {
              handleChange('tipoStock', value);
            }}
            allowClear
            options={[
              {
                value: '',
                label: '-------',
              },
              ...[
                'Holstein Friesian',
                'Hereford',
                'Simmental',
                'Aberdeen Angus',
                'Belgian Blue',
                'Limousin',
                'Brangus',
                'Red Angus',
                'Braford',
                'Belted Galloway',
                'Brown Swiss',
                'Beefalo',
                'Other',
              ].map((tipo) => ({
                key: `${tipo}`,
                value: `${tipo}`,
                label: `${tipo}`,
              })),
            ]}
          />
        </Form.Item>

        <Form.Item name="vendido" label="Sold">
          <Select
            onChange={(val) => handleChange('vendido', val)}
            // value={formData.vendido}
            options={[
              { value: '', label: '---------' },
              { value: 'vendido', label: 'Sold with replenishment' },
              { value: 'sinreponer', label: 'Sold with no replenishment' },
              { value: 'sinvender', label: 'Not Sold' },
              { value: 'perdida', label: 'Lost / Death' },
            ]}
          />
        </Form.Item>

        <Form.Item name="fechaCompra" label="Date Purchased">
          <RangePicker
            format={dateFormatList}
            allowEmpty={[false, true]}
            onChange={(val) => handleChange('fechaCompra', val)}
          />
        </Form.Item>

        <Form.Item name="fechaVenta" label="Date Sold">
          <RangePicker
            allowEmpty={[false, true]}
            onChange={(val) => handleChange('fechaVenta', val)}
            // value={[formData.fechaVenta1, formData.fechaVenta2]}
          />
        </Form.Item>

        <Form.Item name="peso" label="Weight">
          <Slider
            range
            min={0}
            max={600}
            onChange={(val) => handleChange('peso', val)}
            // value={[formData.peso1, formData.peso2]}
          />
        </Form.Item>

        <Form.Item noStyle>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isFilterActive() ? 'disabled' : ''}
            style={{ width: '100%' }}
          >
            Filter
          </Button>
        </Form.Item>
        <Form.Item noStyle>
          <Button
            onClick={() => {
              clearFilterData();
              onClose(false);
            }}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Reset Filter
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default Filter;