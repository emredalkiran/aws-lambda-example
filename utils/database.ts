import { MongoClient, Db } from 'mongodb'

export interface DatabaseConnection {
  connect(connectionURL: string, dbName: string, options?: object): Promise<any>
}

export class MongoConnection implements DatabaseConnection {
  private options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  async connect(connectionURL: string, dbName: string): Promise<Db> {
    const connection = new MongoClient(connectionURL, this.options)
    await connection.connect()
    const db = connection.db(dbName)
    return db
  }
}

/* 
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:<password>@cluster0.f05vu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


*/
