'use strict';

import * as chai from 'chai';

import TemperatureMeasurement from './../../../../src/org/bluetooth/characteristic/temperature_measurement';

describe('TemperatureMeasurementのテスト', () => {

  /**
   * [パターン4]
   * -  1:    110
   * -  2~ 5: 体温:36.1度
   * -  6~12: 計測時間: 2017/12/05 00:32:40
   * - 13:    計測タイプ: Body(general)
   */
  describe('パターン4: 正常_データ読み込みテスト', () => {

    let temperatureMeasurement = [0x06, 0x69, 0x01, 0x00, 0xFF, 0xE1, 0x07, 0x0C, 0x05, 0x00, 0x20, 0x28, 0x02];

    let littleEndian = true;

    // 上記で定義した、「temperatureMeasurement」の配列分のバッファーを確保する（今回だと13バイト）
    let dv = new DataView(new ArrayBuffer(temperatureMeasurement.length));
    // データをセットする
    temperatureMeasurement.forEach((value, index) => {
      dv.setUint8(index, value);
    });
    let tm = new TemperatureMeasurement(dv.buffer, littleEndian);
    
    it('温度が「36.1度」であることを確認する', () => {
      chai.assert.equal(tm.getValue(), 36.1);
    });
    it('温度の単位が「Celsius」（摂氏：度）であることを確認する', () => {
      chai.assert.equal(tm.getUnit(), 'Celsius');
    });
    it('計測時間が「2017/12/05 00:32:40」であることを確認する', () => {
      let timestamp = new Date(2017, 12-1, 5, 0, 32, 40).getTime();
      chai.assert.equal(tm.getTimestamp(), timestamp);
    });
    it('計測タイプが「Body (general)」であることを確認する', () => {
      chai.assert.equal(tm.getType(), 'Body (general)');
    });
  });
});

