# bluetoothJS
Bluetoothで取得したデータをJavaScriptで解析するための処理です。


# 利用イメージ

## Bluetoothで受信した温度データを扱う

```
 /**
  * Name: Temperature Measurement
  * Type: org.bluetooth.characteristic.temperature_measurementDownload / View
  * Assigned Number: 0x2A1C
  *
  * 参考)
  *    https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.temperature_measurement.xml
  */

  // 1. 仮データの準備
  // 　※ 本来は、実際にBLEで取得したデータを利用下さい。
  let temperatureMeasurement = [0x06, 0x69, 0x01, 0x00, 0xFF, 0xE1, 0x07, 0x0C, 0x05, 0x00, 0x20, 0x28, 0x02];

  let buffer = new ArrayBuffer(temperatureMeasurement.length);
  let dv = new DataView(buffer);
  temperatureMeasurement.forEach((value, index) => {
    dv.setUint8(index, value);
  }); 
  
  // 2. [0x2A1C]体温を扱うクラスにバイナリデータを渡して初期化する
  import TemperatureMeasurement from './src/org/bluetooth/characteristic/temperature_measurement';  
  let littleEndian = treu;
  let tm = new TemperatureMeasurement(dv.buffer, littleEndian);
  
  // 3. 必要なデータを取得する
  console.log('温度:' + tm.getValue());                        // 温度:36.1
  console.log('単位:' + tm.getUnit());                         // 単位:Celsius
  console.log('計測時間(Timestamp):' + tm.getTimestamp());      // 計測時間(Timestamp):　1512401560000
  console.log('計測時間(日時):' + new Date(tm.getTimestamp()));  // 計測時間(日時):Tue Dec 05 2017 00:32:40 GMT+0900 (JST)
  console.log('計測タイプ:' + tm.getType());                     // 計測タイプ:Body(general)
```

# 参考

JavaScriptでバイナリデータを扱ったり、Blutoothの扱いに下記にてまとめております。

- [[基礎編]JavaScriptでバイナリデータを扱ってみる](https://qiita.com/megadreams14/items/dded3cf770010bb8ff08)
- [[応用編]JavaScriptでバイナリデータを扱ってみる Bluetoothの温度データ形式を理解する (1/3)](https://qiita.com/megadreams14/items/5e0faae03fdfbca2f7fa)
- [[応用編]JavaScriptでバイナリデータを扱ってみる IEEE-754とIEEE-11073の浮動小数点 (2/3)](https://qiita.com/megadreams14/items/1c88e71d87970bc8ab90)
- [[応用編]JavaScriptでバイナリデータを扱ってみる Bluetoothから取得した温度データを解析 (3/3)](https://qiita.com/megadreams14/items/dee8fcf50f373a1d755d)
