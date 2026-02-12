import joi from "joi"

export const SignupSchema = joi.object({
    name: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: joi.string()
        .pattern(new RegExp(`^[a-zA-Z0-9@]{3,30}$`))
        .required(),
})

export const LoginSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),

    password: joi.string()
        .pattern(new RegExp(`^[a-zA-z0-9@]{3,30}$`))
        .required()
})