import { PrismaClient } from '@prisma/client';
import { body } from 'express-validator'

const prisma = new PrismaClient()

export const registerValidations = [
    body('email').trim().isEmail().custom(async email => {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });
        if (user) throw new Error('Este e-mail já está em uso');
    }),
    body('name').notEmpty().trim().withMessage('O nome é obrigatório'),
    body('password').notEmpty().trim().withMessage('A senha é obrigatória'),
    body('passwordConfirmation').trim().custom((value, { req }) => {
        return value === req.body.password
    }).withMessage('A senha deve coincidir com a confirmação')
]