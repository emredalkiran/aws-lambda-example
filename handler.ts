import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import { eventSchema } from './utils/event-schema'
import { DatabaseConnection, MongoConnection } from './utils/database'
import { EventRepository, EventRepoInterface } from './event/event-repository'

let databaseConnection = null

export async function connectToDataBase() {
  if (databaseConnection) return databaseConnection

  const connection: DatabaseConnection = new MongoConnection()
  databaseConnection = await connection.connect(
    `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.f05vu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    process.env.DB_NAME
  )
  return databaseConnection
}

async function getEventRepo() {
  if (!databaseConnection) await connectToDataBase()
  const repository: EventRepoInterface = new EventRepository(databaseConnection)
  return repository
}

export async function registerEvent(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let data = {}
  try {
    data = JSON.parse(event.body)
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: 'Invalid request while parsing body'
      })
    }
  }
  const { error, value } = eventSchema.validate(data)
  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: 'Invalid request from schema validation'
      })
    }
  }

  const eventRepository: EventRepoInterface = await getEventRepo()

  try {
    eventRepository.addEvent(value)
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
      })
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Can't save the event data"
      })
    }
  }
}
