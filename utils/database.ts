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
