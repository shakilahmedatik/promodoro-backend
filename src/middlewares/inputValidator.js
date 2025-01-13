import Joi from 'joi'

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  image: Joi.string().uri().required().messages({
    'string.uri': 'Image must be a valid URL.',
    'any.required': 'Image is required.',
  }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'string.pattern.base':
        'Password must include at least one letter and one number.',
      'any.required': 'Password is required.',
    }),
})

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body)
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    })
  next()
}

export default validateUser
