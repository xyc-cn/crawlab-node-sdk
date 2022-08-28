## Crawlab nodejs sdk
用于在crawlab的nodejs爬虫任务把爬取的内容写进结果集里。兼容crawlab 0.6.0版本

安装
```sh
# npm
npm i crawlab-node-sdk
# pnpm
pnpm add crawlab-node-sdk
```
使用

```javascript
const { getCollection } = require('crawlab-node-sdk')

/** 
 *  getCollection 默认参数，可以自己传其他的
const defaultOptions = {
  username: process.env["CRAWLAB_MONGO_USERNAME"] || "",
  password: process.env["CRAWLAB_MONGO_PASSWORD"] || "",
  host: process.env["CRAWLAB_MONGO_HOST"] || "",
  port: process.env["CRAWLAB_MONGO_PORT"] || "",
  db: process.env["CRAWLAB_MONGO_DB"] || "",
  path: "",
};
 * 
 * **/

async function test() {
   const collection = await getCollection();
   const testData =  [
     	{
          book: 556677,
          page: 1,
        },
     	{
          book: 556677,
          page: 2,
        },{
          book: 556677,
          page: 3,
        },{
          book: 556677,
          page: 4,
        },{

          book: 556677,
          page: 5,
        }
    ]
   
   const insertResult = await collection.addDataList(testData);
   console.log('Inserted documents =>', insertResult);
}

test().then(()=>{
  process.exit(0)
})
```
对应环境的docker-compose.yml
```yml
version: '3.3'
services:
  master:
    image: node-crawlab
    container_name: crawlab_master
    restart: always
    environment:
      CRAWLAB_NODE_MASTER: "Y"  # Y: 主节点
      CRAWLAB_MONGO_HOST: "mongo" # mongo host address
      CRAWLAB_MONGO_PORT: "27017"  # mongo port 
      CRAWLAB_MONGO_DB: "crawlab"  # mongo database 
      CRAWLAB_MONGO_USERNAME: "username"  # mongo username
      CRAWLAB_MONGO_PASSWORD: "password"  # mongo password 
      CRAWLAB_MONGO_AUTHSOURCE: "admin"  # mongo auth source 
    volumes:
      - "/opt/crawlab/master:/data"  # 持久化 crawlab 数据
    ports:
      - "7878:8080"  # 开放 api 端口
    depends_on:
      - mongo

  mongo:
    image: mongo:4.2
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: "username"  # mongo username
      MONGO_INITDB_ROOT_PASSWORD: "password"  # mongo password
    volumes:
      - "/opt/crawlab/mongo/data/db:/data/db"  # 持久化 mongo 数据
    ports:
      - "27017:27017"  # 开放 mongo 端口到宿主机
```

# ChangeLog
 * 0.0.1 初始化
 * 0.0.3 添加readme说明