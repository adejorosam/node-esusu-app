const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
}).options({ abortEarly: false })


module.exports = {
  authSchema,
}