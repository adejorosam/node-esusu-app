const Joi = require('@hapi/joi')

const groupSchema = Joi.object({
  groupName: Joi.string().required(),
  maximumCapacity: Joi.number().required(),
  groupDescription: Joi.string().required(),
  periodicAmount: Joi.number().required()
}).options({ abortEarly: false })


module.exports = {
  groupSchema,
}


