/* eslint @typescript-eslint/no-var-requires: "off" */

const Joi = require('joi')

export const eventSchema = Joi.object({
  eventType: Joi.string().required().valid('buttonclick', 'navigationclick'),
  eventSource: Joi.string().required().min(2),
  userId: Joi.string().optional().guid()
})
