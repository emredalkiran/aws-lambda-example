import { Db } from 'mongodb'
import { Event } from '../utils/types'
export interface EventRepoInterface {
  addEvent(data: Event): Promise<any>
}

export class EventRepository implements EventRepoInterface {
  db: Db
  constructor(db: Db | any) {
    this.db = db
  }
  addEvent(data: Event): Promise<any> {
    return this.db
      .collection('events')
      .insertOne({ ...data, timeStamp: new Date() })
  }
}
