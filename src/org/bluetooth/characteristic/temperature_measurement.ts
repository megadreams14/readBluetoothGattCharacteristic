
import BluetoothFormat from './../../../lib/bluetooth_format';

/**
 * BLEで受信した温度データを扱うクラス
 *
 * Name: Temperature Measurement
 * Type: org.bluetooth.characteristic.temperature_measurementDownload / View
 * Assigned Number: 0x2A1C
 *
 * 参考)
 *    https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.temperature_measurement.xml
 */
class TemperatureMeasurement {

  private buffer:DataView;

  private littleEndian:boolean;

  private offset:any;

  constructor(buffer, littleEndian = false) {
    // バイナリデータを管理する
    this.buffer = new DataView(buffer);
    this.littleEndian = littleEndian;

    // 各種データのメモリ使用量を定義する
    this.offset = {
      init: 0,                        // 初期バイト位置を記録
      flags: 1,                       // フラグ管理に1バイト利用する
      temperatureMeasurementValue: 4, // 温度は、4バイト利用
      timestamp: 7,                   // 計測時間は、7バイト利用
      temperatureType: 1,             // 計測タイプは、1バイト利用
    };
  }

  /****************************************************
   * 1バイト目の各種フラグが立っているかをチェックする
   ****************************************************/
  /**
   * 1ビット目: 温度の設定をチェック
   */
  private checkTemperatureMeasurementValueFlats() {
    return ((this.getFlags() & 0x01) >= 1);
  }
  /**
   * 2ビット目: 計測時間の記録有無をチェック
   */
  private checkTimestampFlags() {
    return ((this.getFlags() & 0x02) >= 1);
  }
  /**
   * 3ビット目: 温度タイプの記録有無をチェック
   */
  private checkTemperatureTypeFlags() {
    return ((this.getFlags() & 0x03) >= 1);
  }


  /****************************************************
   * バイナリデータの読み込み位置を取得する
   ****************************************************/
  /**
   * 計測時間のバイナリデータのoffsetを取得する
   */
  private getTimestampOffset() {
    return this.offset.init + this.offset.flags + this.offset.temperatureMeasurementValue;
  }

  /**
   * 計測タイプのバイナリデータのoffsetを取得する
   *
   * - 計測時間の記録があるときとないときで開始位置が異なる
   */
  private getTemperatureTypeOffset() {
    let offset = this.getTimestampOffset();
    if (this.checkTimestampFlags()) {
      offset += this.offset.timestamp;
    }
    return offset;
  }


  /****************************************************
   * バイナリデータから各種データを読み込む処理
   ****************************************************/
  /**
   * [Flags]
   * 各データがどのように保持されているかの情報を取得する
   */
  getFlags() {
    return this.buffer.getUint8(this.offset.init);
  }

  /**
   * [温度データ]
   * 摂氏(℃) または 華氏(°F)にて温度データを取得する
   *
   * どちらの場合でも、2バイト目から「IEEE-11073 32-bit FLOAT」形式で保存されている
   */
  getValue() {
    let offset = this.offset.init + this.offset.flags;
    // 2~5バイト目までが温度を管理している部分であるため、対象のバイナリデータを抜き出す
    return BluetoothFormat.readFLOAT(this.buffer, offset, this.littleEndian);
  }

  /**
   * [温度単位]
   * 単位を取得する
   *
   * Flagsの1ビット目の値が、
   *  - 0の場合は、摂氏(℃)  : Celsius
   *  - 1の場合は、華氏(°F) : Fahrenheit.
   */
  getUnit() {
    if (this.checkTemperatureMeasurementValueFlats()) {
      return 'Fahrenheit';
    } else {
      return 'Celsius';
    }
  }


  /**
   * [温度計測時間]
   * 計測時間があれば、UnixTimestamp形式で返す
   *
   * Flagsの2ビット目の値が1であれば時間を返す
   */
  getTimestamp() {
    if (this.checkTimestampFlags()) {
      let offset = this.getTimestampOffset();
      return BluetoothFormat.readDateTime(this.buffer, offset, this.littleEndian);
    } else {
      return 0;
    }
  }

  /**
   * [温度タイプ]
   * 計測タイプがあれば、計測タイプを返す
   *
   * Flagsの3ビット目の値が1であれば時間を返す
   */
  getType() {
    if (this.checkTemperatureTypeFlags()) {
      let offset = this.getTemperatureTypeOffset();
      return BluetoothFormat.readTemperatureType(this.buffer, offset);
    } else {
      return 0;
    }
  }
}

export default TemperatureMeasurement;
