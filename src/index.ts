import {
  MongoClient,
  ObjectId,
  Db,
  Collection,
  Document,
  OptionalId,
  InsertManyResult,
} from "mongodb";

interface connectOption {
  username: string;
  password: string;
  host: string;
  port: string;
  db: string;
  path: string;
}

interface NewCollection<Document> extends Collection<Document> {
  addDataList?: (
    docs: OptionalId<Document>[]
  ) => Promise<InsertManyResult<Document>>;
}

const defaultOptions: connectOption = {
  username: process.env["CRAWLAB_MONGO_USERNAME"] || "",
  password: process.env["CRAWLAB_MONGO_PASSWORD"] || "",
  host: process.env["CRAWLAB_MONGO_HOST"] || "",
  port: process.env["CRAWLAB_MONGO_PORT"] || "",
  db: process.env["CRAWLAB_MONGO_DB"] || "",
  path: "",
};

const spiderCollectionName = "spiders";
const taskCollectionName = "tasks";
const taskStatusCollectionName = "task_stats";
const colCollectionName = "data_collections";

let client: MongoClient;

async function getClient(resultOption: connectOption): Promise<MongoClient> {
  const url = `mongodb://${resultOption.username}:${resultOption.password}@${resultOption.host}:${resultOption.port}${resultOption.path}`;
  const tempClient = new MongoClient(url);
  await tempClient.connect();
  console.log("Connected successfully to server");
  client = tempClient;
  return client;
}

function enHanceCollect(collection: NewCollection<Document>, db: Db): void {
  const taskId = new ObjectId(process.env["CRAWLAB_TASK_ID"]);
  const taskStatusColCollection = db.collection(taskStatusCollectionName);
  collection.addDataList = async function (insertArray) {
    const newParams = insertArray.map((item) => {
      item._tid = taskId;
      return item;
    });
    const insertResult = await collection.insertMany(newParams);
    const updateResult = await taskStatusColCollection.updateOne(
      { _id: taskId },
      { $set: { result_count: insertArray.length } }
    );
    return insertResult;
  };
}

async function getCollectionName(db: Db): Promise<string> {
  const spidersCollection = db.collection(spiderCollectionName);
  const tasksCollection = db.collection(taskCollectionName);
  const colCollection = db.collection(colCollectionName);
  const currentTask = await tasksCollection
    .find({ _id: new ObjectId(process.env["CRAWLAB_TASK_ID"]) })
    .toArray();
  const spiderId = currentTask && currentTask[0] && currentTask[0].spider_id;
  const currentSpider = await spidersCollection
    .find({ _id: spiderId })
    .toArray();
  const colId = currentSpider && currentSpider[0] && currentSpider[0].col_id;
  const currentCol = await colCollection.find({ _id: colId }).toArray();
  const returnCollectionName =
    currentCol && currentCol[0] && currentCol[0].name;
  return returnCollectionName;
}

async function getCollection(
  option: Partial<connectOption> = {}
): Promise<Collection<Document>> {
  const resultOption = Object.assign({}, defaultOptions, option);
  if (!client) {
    client = await getClient(resultOption);
  }

  const db = client.db(resultOption.db);
  const collectionName = await getCollectionName(db);
  const collection = db.collection(collectionName);
  enHanceCollect(collection, db);
  return collection;
}

module.exports = {
  getCollection,
};
