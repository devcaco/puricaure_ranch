import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Col, Row, Spin } from 'antd';
import { DatePicker, InputNumber, Select, Button } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import styles from './StockDetails.module.css';

dayjs.extend(customParseFormat);
const dateFormatList = ['MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY'];

const StockDetails = ({ stockId, onClose, langText }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [stockDetails, setStockDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [stockReposicion, setStockReposicion] = useState([]);
  const [formData, setformData] = useState({});
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const fetchStockDetails = async () => {
      setDataLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_API + 'stock/details/' + stockId
        );

        console.log({ TheDetails: response.data.stockDetails });

        if (response.data.ok) {
          const data = response.data.stockDetails;
          setStockDetails({ ...data.response, profit: data.profit });
          setformData(data);
        } else throw new Error(response.data.errorMsg);
        setDataLoading(false);
      } catch (err) {
        console.log('ERROR -> ', err.message);
        setErrorMsg(err.message);
        setDataLoading(false);
      }
    };

    fetchStockDetails();
  }, [stockId]);

  const handleChange = (name, value) => {};
  return (
    <div className={styles.details}>
      <div className={styles.details__header}>
        <h2>
          {langText['stock_details_title']} {stockDetails.serialNro}
        </h2>
        <div className={styles.errorMsg}>{errorMsg}</div>
      </div>
      {stockDetails && (
        <>
          <div className={styles['details__body-container']}>
            <Row gutter={[16, 16]} id="MAIN_CONTAINER_FLEX">
              <Col
                span={12}
                className={styles['details__body--container-left']}
                id="LEFT_SECTION"
              >
                <Spin spinning={dataLoading}>
                  <Row style={{ paddingBottom: '20px' }} id="DATOS_COMPRA">
                    <Col span={24} className={[styles['section__container']]}>
                      <div>
                        {langText['stock_details_purchase_details_title']}
                      </div>
                      <div className={[styles['section__body']]}>
                        <Row
                          align="middle"
                          className={[styles['section__row']]}
                        >
                          <Col span={12}>
                            {langText['stock_details_purchase_label_date']}
                          </Col>
                          <Col span={12}>
                            {!editMode
                              ? !dataLoading &&
                                new Date(
                                  stockDetails.compra?.fecha
                                ).toLocaleDateString()
                              : !dataLoading && (
                                  <DatePicker
                                    value={dayjs(formData.compra?.fecha)}
                                    style={{ width: '100%' }}
                                    size="middle"
                                    format={dateFormatList}
                                    onChange={(date, dateString) => {
                                      handleChange(
                                        'fechaCompra',
                                        dayjs(date, dateFormatList[0])
                                      );
                                    }}
                                  />
                                )}
                          </Col>
                        </Row>
                        <Row
                          align="middle"
                          className={[styles['section__row']]}
                        >
                          <Col span={12}>
                            {langText['stock_details_purchase_label_weight']}
                          </Col>
                          <Col span={12}>
                            {!editMode
                              ? !dataLoading &&
                                stockDetails.compra?.peso?.peso + ' Kgs'
                              : !dataLoading && (
                                  <InputNumber
                                    onChange={(value) => {
                                      handleChange('pesoCompra', value);
                                    }}
                                    step={1}
                                    value={formData.compra?.peso?.peso}
                                    style={{ width: '100%' }}
                                    min={1}
                                    size="middle"
                                    addonAfter={
                                      <Select
                                        size="small"
                                        name="unidadPeso"
                                        onChange={(value) => {
                                          handleChange('unidadPeso', value);
                                        }}
                                        options={[
                                          {
                                            value: 'kg',
                                            label: 'K',
                                          },
                                          {
                                            value: 'lb',
                                            label: 'Lb',
                                          },
                                          {
                                            value: 'grm',
                                            label: 'Grm',
                                          },
                                        ]}
                                      />
                                    }
                                  />
                                )}
                          </Col>
                        </Row>
                        <Row
                          align="middle"
                          className={[styles['section__row']]}
                        >
                          <Col span={12}>
                            {langText['stock_details_purchase_label_price']}
                          </Col>
                          <Col span={12}>
                            {!editMode
                              ? !dataLoading &&
                                '$ ' + stockDetails.compra?.precio
                              : !dataLoading && (
                                  <InputNumber
                                    onChange={(value) => {
                                      handleChange('precioCompra', value);
                                    }}
                                    value={formData?.compra?.precio}
                                    min={0}
                                    step={0.01}
                                    addonBefore={' $ '}
                                    size="middle"
                                    style={{ width: '100%' }}
                                  />
                                )}
                          </Col>
                        </Row>
                        <Row
                          align="middle"
                          className={[styles['section__row']]}
                        >
                          <Col span={12}>
                            {
                              langText[
                                'stock_details_purchase_label_total_price'
                              ]
                            }
                          </Col>
                          <Col span={12}>
                            {!dataLoading &&
                              '$ ' +
                                stockDetails?.totalPrecioCompra?.toFixed(2)}
                          </Col>
                        </Row>
                        {stockDetails.compra?.reposicion?.serialNro && (
                          <Row
                            align="middle"
                            className={[styles['section__row']]}
                          >
                            <Col span={12}>
                              {
                                langText[
                                  'stock_details_purchase_label_replenishment'
                                ]
                              }
                            </Col>
                            <Col span={12}>
                              {!editMode
                                ? !dataLoading &&
                                  stockDetails?.compra?.reposicion &&
                                  stockDetails?.compra?.reposicion?.serialNro
                                : !dataLoading && (
                                    <Select
                                      style={{ width: '100%' }}
                                      size="middle"
                                      placeholder={
                                        langText['table_search_placeholder']
                                      }
                                      value={formData?.compra?.reposicion?._id}
                                      showSearch
                                      optionFilterProp="children"
                                      onChange={(value) => {
                                        handleChange('stockReposicion', value);
                                      }}
                                      disabled={
                                        stockReposicion.length ? 'disabled' : ''
                                      }
                                      filterOption={(input, option) =>
                                        (option?.label ?? '')
                                          .toLowerCase()
                                          .includes(input.toLowerCase())
                                      }
                                      options={[
                                        {
                                          value: '',
                                          label: '-------',
                                        },
                                        ...stockReposicion.map((stock) => ({
                                          key: `${stock._id}`,
                                          value: `${stock._id}`,
                                          label: `${stock.stockNro}`,
                                        })),
                                      ]}
                                    />
                                  )}
                            </Col>
                          </Row>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Spin>
                {stockDetails.venta?.fecha && (
                  <Spin spinning={dataLoading}>
                    <Row id="DATOS_VENTA">
                      <Col span={24} className={[styles['section__container']]}>
                        <div>
                          {langText['stock_details_sale_details_title']}
                        </div>
                        <div className={[styles['section__body']]}>
                          <Row
                            align="middle"
                            className={[styles['section__row']]}
                          >
                            <Col span={12}>
                              {langText['stock_details_sale_label_date']}
                            </Col>
                            <Col span={12}>
                              {!editMode
                                ? !dataLoading &&
                                  new Date(
                                    stockDetails?.venta?.fecha
                                  ).toLocaleDateString()
                                : !dataLoading && (
                                    <DatePicker
                                      value={dayjs(formData?.venta?.fecha)}
                                      format={dateFormatList}
                                      onChange={(date, dateString) => {
                                        handleChange(
                                          'fechaVenta',
                                          dayjs(date, dateFormatList[0])
                                        );
                                      }}
                                    />
                                  )}
                            </Col>
                          </Row>
                          <Row
                            align="middle"
                            className={[styles['section__row']]}
                          >
                            <Col span={12}>
                              {langText['stock_details_sale_label_days']}
                            </Col>
                            <Col span={12}>
                              {!dataLoading && stockDetails?.diasTranscurridos}
                            </Col>
                          </Row>
                          <Row
                            align="middle"
                            className={[styles['section__row']]}
                          >
                            <Col span={12}>
                              {langText['stock_details_sale_label_avg_weight']}
                            </Col>
                            <Col span={12}>
                              {!dataLoading &&
                                stockDetails?.pesoPromedio?.toFixed(2) + ' Kgs'}
                            </Col>
                          </Row>
                          <Row
                            align="middle"
                            className={[styles['section__row']]}
                          >
                            <Col span={12}>
                              {langText['stock_details_sale_label_weight']}
                            </Col>
                            <Col span={12}>
                              {!editMode
                                ? !dataLoading &&
                                  stockDetails?.venta?.peso.peso + ' Kgs'
                                : !dataLoading && (
                                    <InputNumber
                                      onChange={(value) => {
                                        handleChange('pesoVenta', value);
                                      }}
                                      value={formData?.venta?.peso.peso}
                                      step={1}
                                      min={1}
                                      style={{ width: '7rem' }}
                                      addonAfter={
                                        <Select
                                          size="small"
                                          onChange={(value) => {
                                            // handleChange('unidadPeso', value);
                                          }}
                                          options={[
                                            {
                                              value: 'kg',
                                              label: 'kg',
                                            },
                                            {
                                              value: 'lb',
                                              label: 'lb',
                                            },
                                            {
                                              value: 'grm',
                                              label: 'grm',
                                            },
                                          ]}
                                        />
                                      }
                                    />
                                  )}
                            </Col>
                          </Row>
                          <Row
                            align="middle"
                            className={[styles['section__row']]}
                          >
                            <Col span={12}>
                              {langText['stock_details_sale_label_price']}
                            </Col>
                            <Col span={12}>
                              {!dataLoading && !editMode ? (
                                '$ ' + stockDetails?.venta?.precio
                              ) : (
                                <InputNumber
                                  onChange={(value) => {
                                    handleChange('precioVenta', value);
                                  }}
                                  min={0}
                                  step={0.1}
                                  addonBefore={' $ '}
                                  style={{ width: '6rem' }}
                                />
                              )}
                            </Col>
                          </Row>
                          <Row
                            align="middle"
                            className={[styles['section__row']]}
                          >
                            <Col span={12}>
                              {langText['stock_details_sale_label_total_price']}
                            </Col>
                            <Col span={12}>
                              {!dataLoading &&
                                '$ ' +
                                  stockDetails?.totalPrecioVenta?.toFixed(2)}
                            </Col>
                          </Row>
                          {stockDetails?.venta?.reposicion?.serialNro && (
                            <Row
                              align="middle"
                              className={[styles['section__row']]}
                            >
                              <Col span={12}>
                                {
                                  langText[
                                    'stock_details_sale_label_replenishment'
                                  ]
                                }
                              </Col>
                              <Col span={12}>
                                {!dataLoading &&
                                  stockDetails?.venta?.reposicion?.serialNro}
                              </Col>
                            </Row>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Spin>
                )}
              </Col>
              <Col span={12} id="RIGHT_SECTION">
                {stockDetails.venta?.fecha &&
                  stockDetails.venta?.reposicion && (
                    <Spin spinning={dataLoading}>
                      <Row
                        style={{ paddingBottom: '20px' }}
                        id="DATOS_GANANCIA"
                      >
                        <Col
                          span={24}
                          className={[styles['section__container']]}
                        >
                          <div>
                            {langText['stock_details_profit_details_title']}
                          </div>
                          <div className={[styles['section__body']]}>
                            <Row
                              align="middle"
                              className={[styles['section__row']]}
                            >
                              <Col span={12}>
                                {langText['stock_details_profit_text']}
                              </Col>
                              <Col span={12}>
                                $ {stockDetails?.profit?.toFixed(2)}
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </Spin>
                  )}
                <Spin spinning={dataLoading}>
                  <Row id="DATOS_PESO">
                    <Col span={24} className={[styles['section__container']]}>
                      <div>
                        {langText['stock_details_weight_details_title']}
                      </div>
                      <div className={[styles['section__body']]}>
                        {!dataLoading &&
                          stockDetails?.pesos?.length &&
                          stockDetails.pesos.map((peso) => (
                            <Fragment key={peso._id}>
                              <Row
                                align="middle"
                                className={[styles['section__row']]}
                              >
                                <Col span={8}>
                                  {new Date(peso.fecha).toLocaleDateString()}
                                </Col>
                                <Col span={8}>{peso.peso} Kgs.</Col>
                                <Col span={8}>
                                  {peso.tipo &&
                                    peso.tipo
                                      .replace(
                                        'venta',
                                        langText[
                                          'stock_details_weight_sale_text'
                                        ]
                                      )
                                      .replace(
                                        'compra',
                                        langText[
                                          'stock_details_weight_purchase_text'
                                        ]
                                      )
                                      .replace(
                                        'control',
                                        langText[
                                          'stock_details_weight_control_text'
                                        ]
                                      )}
                                </Col>
                              </Row>
                            </Fragment>
                          ))}
                      </div>
                    </Col>
                  </Row>
                </Spin>
              </Col>
            </Row>
          </div>
          <div className={styles['details__footer']}>
            <Button
              type="primary"
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              {editMode
                ? langText['stock_details_btn_save']
                : langText['stock_details_btn_edit']}
            </Button>
            <Button onClick={onClose} style={{ marginTop: '20px' }}>
              {langText['stock_details_btn_close']}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StockDetails;
