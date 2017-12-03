'use strict';

import * as chai from 'chai';

import BluetoothFormat from './../../src/lib/bluetooth_format';

describe('BluetoothFormatのテスト', () => {
  describe('readFLOATのテスト', () => {

    it('バッファが足りない場合にはエラーとなる', () => {
      let buffer = new ArrayBuffer(2);
      let dv = new DataView(buffer);
      // Errorがthrowされることを確認
      chai.assert.throws(() => { BluetoothFormat.readFLOAT(dv, 0) }, RangeError, 'Offset is outside the bounds of the DataView');
    });

    it('「0x69 0x01 0x00 0xFF」が「36.1」であることを確認する', () => {
      let offset = 0;
      let littleEndian = true;
      
      // 32ビットのバッファ領域を確保
      let buffer = new ArrayBuffer(4);
      // 32ビット データを書き込み
      let dv = new DataView(buffer);
      dv.setUint32(offset, 0x690100FF);

      var result = BluetoothFormat.readFLOAT(dv, offset, littleEndian);      
      chai.assert.equal(result, 36.1);
    });

    it('「0x1F 0x0E 0x00 0xFE」が「36.15」であることを確認する', () => {
      let offset = 0;
      let littleEndian = true;

      let buffer = new ArrayBuffer(4);
      let dv = new DataView(buffer);
      dv.setUint32(offset, 0x1F0E00FE);

      var result = BluetoothFormat.readFLOAT(dv, offset, littleEndian);      
      chai.assert.equal(result, 36.15);
    });

  
    it('マイナス値であることも計算する', () => {
      // 32ビットのバッファ領域を確保
      let buffer = new ArrayBuffer(4);
      // 32ビット データを書き込み
      let dv = new DataView(buffer);
      dv.setUint32(0, 0x690100FF);
      let offset = 0;
      let littleEndian = true;

      var result = BluetoothFormat.readFLOAT(dv, offset, littleEndian);      
      // Errorがthrowされることを確認
      chai.assert.equal(result, 36.1, 'Offset is outside the bounds of the DataView');
    });
  });

  describe('readDateTimeのテスト', () => {
    
    it('バッファが足りない場合にはエラーとなる', () => {
      let buffer = new ArrayBuffer(2);
      let dv = new DataView(buffer);
      // Errorがthrowされることを確認
      chai.assert.throws(() => { BluetoothFormat.readDateTime(dv, 0) }, RangeError, 'Offset is outside the bounds of the DataView');
    });

    it('「0xE1, 0x07, 0x0C, 0x05, 0x00, 0x20, 0x28」が「2017/12/05 00:32:40」であることを確認する', () => {
      let offset = 0;
      let littleEndian = true;
      
      // 32ビットのバッファ領域を確保
      let buffer = new ArrayBuffer(7);
      // 32ビット データを書き込み
      let dv = new DataView(buffer);
      dv.setUint8(0, 0xE1);
      dv.setUint8(1, 0x07);
      dv.setUint8(2, 0x0C);
      dv.setUint8(3, 0x05);
      dv.setUint8(4, 0x00);
      dv.setUint8(5, 0x20);
      dv.setUint8(6, 0x28);

      var result = BluetoothFormat.readDateTime(dv, offset, littleEndian);      
      let date = new Date(2017, 11, 5, 0, 32,40).getTime();
      chai.assert.equal(result, date);
    });
  });

  describe('readTemperatureTypeのテスト', () => {
    
    it('バッファが足りない場合にはエラーとなる', () => {
      let buffer = new ArrayBuffer(0);
      let dv = new DataView(buffer);
      // Errorがthrowされることを確認
      chai.assert.throws(() => { BluetoothFormat.readTemperatureType(dv, 0) }, RangeError, 'Offset is outside the bounds of the DataView');
    });

    it('1のときは、「 Armpit 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x01);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Armpit');
    });
    
    it('2のときは、「 Body (general) 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x02);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Body (general)');
    });

    it('3のときは、「 Ear (usually ear lobe) 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x03);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Ear (usually ear lobe)');
    });
    
    it('4のときは、「 Finger 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x04);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Finger');
    });

    it('5のときは、「 Gastro-intestinal Tract 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x05);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Gastro-intestinal Tract');
    });

    it('6のときは、「 Mouth 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x06);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Mouth');
    });

    it('7のときは、「Rectum」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x07);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Rectum');
    });
    
    it('8のときは、「 Toe 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x08);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Toe');
    });

    it('9のときは、「 Tympanum (ear drum) 」であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x09);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, 'Tympanum (ear drum)');
    });

    it('0のときは、空文字であることを確認する', () => {
      let offset = 0;
      let dv = new DataView(new ArrayBuffer(1));
      dv.setUint8(offset, 0x00);
      var result = BluetoothFormat.readTemperatureType(dv, offset);      
      chai.assert.equal(result, '');
    });
  });

});
