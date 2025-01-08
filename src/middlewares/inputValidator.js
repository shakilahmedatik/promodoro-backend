import Joi from 'joi'

const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  image: Joi.string().uri().required().messages({
    'string.uri': 'Image must be a valid URL.',
    'any.required': 'Image is required.',
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long.',
      'string.pattern.base':
        'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.',
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
