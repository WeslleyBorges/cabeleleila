import { Request, Response, Router } from 'express'
import { matchedData, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt'
import { registerValidations } from './validations';

const prisma = new PrismaClient();

const router = Router();

router.post('/register', registerValidations, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })

        const { name, email, password } = matchedData(req);

        const hashedPassword = await hash(password, 10)

        await prisma.profile.create({
            data: {
                name,
                user: {
                    create: {
                        email,
                        password: hashedPassword
                    }
                }
            }
        })

        return res.status(201).send()
    } catch (error) {
        res.status(500).json({ errors: [error] });
    }
});

export default router