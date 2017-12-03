import { throws } from "assert";

class BluetoothFormat {

  /**
   * 
   * @param dv:DataView   バイナリデータ
   * @param offset:number バイナリデータを読み取る開始位置
   * @param littleEndian:boolean  バイトオーダーの扱い(デフォルトは、false = ビッグエンディアン方式：)
   */
  static readFLOAT(dv:DataView, offset = 0, littleEndian = false):number {
    // 1. バイトオーダーを指定して32ビットデータを取得
    var data = dv.getUint32(offset, littleEndian);

    // 2. 仮数部を取得する(32ビットの場合は下位24ビットが仮数部)
    //    - 取得した32ビットデータに下位24ビットの全てのフラグを立てた値を掛け算することで取得
    var mantissa = (data & 0x00FFFFFF);

    // 仮数部が2の補数かどうかを判定する
    　　　　// 下位24ビットのうちの上位1ビット目にフラグが立っていれば2の補数
    if ((mantissa & 0x00800000) > 0) {
      // 負の値の場合は、2の補数を用いて数値を求める
      mantissa = -1 * (~(mantissa - 0x01) & 0x00FFFFFF)
    }

    // 3. 指数部を取得する(32ビットの場合は上位8ビットが指数部)
    // 上位8ビットを取得するためには、32ビットの場合右へ24ビットシフトさせると取得可能
    // なお、JavaScriptの場合「>>」を利用すると、符号を維持する右シフトであるため、 
    // ビット演算を用いると2の補数も考慮して10進数に変換してくれる
    var exponential = data >> 24;

    // 「仮数部 × 基数部 ^ 指数部」の公式に当てはめて変換
    return mantissa * Math.pow(10, exponential);
  }

  /**
   * 計測時間を返す
   * - Type: org.bluetooth.characteristic.date_time - Assigned Number: 0x2A08
   * 
   * @param dv:DataView   バイナリデータ
   * @param _offset:number バイナリデータを読み取る開始位置
   * @param littleEndian:boolean  バイトオーダーの扱い(デフォルトは、false = ビッグエンディアン方式：)
   */
  static readDateTime(dv:DataView, _offset = 0, littleEndian = false):number {
    let offset = _offset;

    // 時間は、下記の順で計7バイトのデータを扱う
    // 2バイト: 年、 1バイト: 月, 日, 時, 分, 秒
    let year, month, day, hour, minute, second;

    year = dv.getUint16(offset, littleEndian);
    offset += 2;
    // JavaScriptでMonthは0から始まるため、取得した月から1を引いておく
    month = dv.getUint8(offset) - 1;
    offset++;
    day = dv.getUint8(offset);
    offset++;
    hour = dv.getUint8(offset);
    offset++;
    minute = dv.getUint8(offset);
    offset++;
    second = dv.getUint8(offset);

    var dt = new Date(year, month, day, hour, minute, second);
    // UnixTimestampをミリ秒単位で返す
    return dt.getTime();
  }

  /**
   * 計測時の状況を返す
   * - Type: org.bluetooth.characteristic.temperature_type - Assigned Number: 0x2A1D
   * 
   * @param dv:DataView   バイナリデータ
   * @param offset:Number バイナリデータを読み取る開始位置
   */
  static readTemperatureType(dv:DataView, offset = 0):string {
    let typeValue = dv.getUint8(offset);
    let type;
    switch(typeValue) {
      case 1:
        type = 'Armpit';
        break;
      case 2:
        type = 'Body (general)';
        break;
      case 3:
        type = 'Ear (usually ear lobe)';
        break;
      case 4:
        type = 'Finger';
        break;
      case 5:
        type = 'Gastro-intestinal Tract';
        break;
      case 6:
        type = 'Mouth';
        break;
      case 7:
        type = 'Rectum';
        break;
      case 8:
        type = 'Toe';
        break;
      case 9:
        type = 'Tympanum (ear drum)';
        break;
      default:
        type = '';
    }
    return type;
  }

}
export default BluetoothFormat;
