# bluetoothJS
Bluetoothで取得したデータをJavaScriptで解析するための処理です。



# 環境構築

```
 npm install -g typescript mocha istanbul remap-istanbul postinstall-build
```


# テスト実行時

```
# TypeScriptをCompile
tsc

# テスト実行
find build/ -type f -name "*.test.js" | xargs mocha

# テスト実行とカバレッヂの表示
find build/ -type f -name "*.test.js" | xargs istanbul cover _mocha --

# TypeScriptのカバレッジで見れるようにする
remap-istanbul -i ./coverage/coverage.json -o ./coverage/ts-report -t html
```


http://blog.catalyst-system.jp/useful-001/


```
tsc; find build/ -type f -name "*.test.js" | xargs mocha;
```