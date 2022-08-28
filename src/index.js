"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var defaultOptions = {
    username: process.env["CRAWLAB_MONGO_USERNAME"] || "",
    password: process.env["CRAWLAB_MONGO_PASSWORD"] || "",
    host: process.env["CRAWLAB_MONGO_HOST"] || "",
    port: process.env["CRAWLAB_MONGO_PORT"] || "",
    db: process.env["CRAWLAB_MONGO_DB"] || "",
    path: ""
};
var spiderCollectionName = "spiders";
var taskCollectionName = "tasks";
var taskStatusCollectionName = "task_stats";
var colCollectionName = "data_collections";
var client;
function getClient(resultOption) {
    return __awaiter(this, void 0, void 0, function () {
        var url, tempClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "mongodb://".concat(resultOption.username, ":").concat(resultOption.password, "@").concat(resultOption.host, ":").concat(resultOption.port).concat(resultOption.path);
                    tempClient = new mongodb_1.MongoClient(url);
                    return [4 /*yield*/, tempClient.connect()];
                case 1:
                    _a.sent();
                    console.log("Connected successfully to server");
                    client = tempClient;
                    return [2 /*return*/, client];
            }
        });
    });
}
function enHanceCollect(collection, db) {
    var taskId = new mongodb_1.ObjectId(process.env["CRAWLAB_TASK_ID"]);
    var taskStatusColCollection = db.collection(taskStatusCollectionName);
    collection.addDataList = function (insertArray) {
        return __awaiter(this, void 0, void 0, function () {
            var newParams, insertResult, updateResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newParams = insertArray.map(function (item) {
                            item._tid = taskId;
                            return item;
                        });
                        return [4 /*yield*/, collection.insertMany(newParams)];
                    case 1:
                        insertResult = _a.sent();
                        return [4 /*yield*/, taskStatusColCollection.updateOne({ _id: taskId }, { $set: { result_count: insertArray.length } })];
                    case 2:
                        updateResult = _a.sent();
                        return [2 /*return*/, insertResult];
                }
            });
        });
    };
}
function getCollectionName(db) {
    return __awaiter(this, void 0, void 0, function () {
        var spidersCollection, tasksCollection, colCollection, currentTask, spiderId, currentSpider, colId, currentCol, returnCollectionName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spidersCollection = db.collection(spiderCollectionName);
                    tasksCollection = db.collection(taskCollectionName);
                    colCollection = db.collection(colCollectionName);
                    return [4 /*yield*/, tasksCollection
                            .find({ _id: new mongodb_1.ObjectId(process.env["CRAWLAB_TASK_ID"]) })
                            .toArray()];
                case 1:
                    currentTask = _a.sent();
                    spiderId = currentTask && currentTask[0] && currentTask[0].spider_id;
                    return [4 /*yield*/, spidersCollection
                            .find({ _id: spiderId })
                            .toArray()];
                case 2:
                    currentSpider = _a.sent();
                    colId = currentSpider && currentSpider[0] && currentSpider[0].col_id;
                    return [4 /*yield*/, colCollection.find({ _id: colId }).toArray()];
                case 3:
                    currentCol = _a.sent();
                    returnCollectionName = currentCol && currentCol[0] && currentCol[0].name;
                    return [2 /*return*/, returnCollectionName];
            }
        });
    });
}
function getCollection(option) {
    if (option === void 0) { option = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var resultOption, db, collectionName, collection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resultOption = Object.assign({}, defaultOptions, option);
                    if (!!client) return [3 /*break*/, 2];
                    return [4 /*yield*/, getClient(resultOption)];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    db = client.db(resultOption.db);
                    return [4 /*yield*/, getCollectionName(db)];
                case 3:
                    collectionName = _a.sent();
                    collection = db.collection(collectionName);
                    enHanceCollect(collection, db);
                    return [2 /*return*/, collection];
            }
        });
    });
}
module.exports = {
    getCollection: getCollection
};
