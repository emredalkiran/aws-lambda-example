import { APIGatewayEvent, Context } from 'aws-lambda'
import * as handler from '../handler'
import { eventSchema } from '../utils/event-schema'

test('Validates buttonclick event succesfully', async () => {
  const event = {
    body: {
      eventType: 'buttonclick',
      eventSource: 'testSource',
      userId: '2f762d70-9d5f-11eb-900b-b341cdc1777a'
    }
  }

  const response = eventSchema.validate(event.body)
  expect(response.value.eventType).toEqual('buttonclick')
  expect(response.error).toBeUndefined()
})

test('Validates navigationclick event succesfully', async () => {
  const event = {
    body: {
      eventType: 'navigationclick',
      eventSource: 'testSource',
      userId: '2f762d70-9d5f-11eb-900b-b341cdc1777a'
    }
  }

  const response = eventSchema.validate(event.body)
  expect(response.value.eventType).toEqual('navigationclick')
  expect(response.error).toBeUndefined()
})

test('Does not allow invalid eventType request', async () => {
  const event = {
    body: JSON.stringify({
      eventType: 'someundefinedeventtype',
      eventSource: 'testSource',
      userId: '2f762d70-9d5f-11eb-900b-b341cdc1777a'
    })
  } as APIGatewayEvent
  const context = {} as Context

  const response = await handler.registerEvent(event, context)
  expect(response.statusCode).toEqual(400)
  expect(JSON.parse(response.body).message).toEqual(
    'Invalid request from schema validation'
  )
})

test('Does not allow invalid body format', async () => {
  const event = {
    body: 'Body data'
  } as APIGatewayEvent
  const context = {} as Context

  const response = await handler.registerEvent(event, context)
  expect(response.statusCode).toEqual(400)
  expect(JSON.parse(response.body).message).toEqual(
    'Invalid request while parsing body'
  )
})
