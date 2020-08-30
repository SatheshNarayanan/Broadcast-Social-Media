const Joi = require("joi");
const stats = ["Single", "Married", "Committed", "Complicated"];
const gen = ["Male", "Female"];

const userSchema = Joi.object().keys({
  firstName: Joi.string()
    .regex(/^[A-Za-z]*$/)
    .required(),
  lastName: Joi.string()
    .regex(/^[A-Za-z]*$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(8).required(),
  status: Joi.string()
    .valid(...stats)
    .required(),
  gender: Joi.string()
    .valid(...gen)
    .required(),
  uniqueId: Joi.string().required()
  //Joi.number().min(0).max(40).required()
});

const editSchema = Joi.object().keys({
  firstName: Joi.string()
    .regex(/^[A-Za-z]*$/)
    .required(),
  lastName: Joi.string()
    .regex(/^[A-Za-z]*$/)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  status: Joi.string()
    .valid(...stats)
    .required(),
  gender: Joi.string()
    .valid(...gen)
    .required(),
  uniqueId: Joi.string().required()
  //Joi.number().min(0).max(40).required()
});

module.exports = { userSchema, editSchema };
