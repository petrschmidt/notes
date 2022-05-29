import client from '../../utils/database';
import {
  API,
  ApiHandler,
  Handler,
  JwtPayload,
  withSession,
} from '../../utils/api';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/constants';

export type RegisterHandler = Handler<{
  request: {
    name: string;
    email: string;
    password: string;
  };
  response: {
    userId: number;
    token: string;
  };
}>;

const handler: ApiHandler<API.Register> = async (req, res) => {
  return new Promise(async (resolve) => {
    if (req.method === 'POST') {
      const { email, password, ...rest } = req.body;

      const matchingUser = await client.user.findUnique({ where: { email } });

      if (matchingUser) {
        res.status(400).json({ err: 'User already exists' });
        resolve();
      } else {
        const hashedPassword = await bcrypt.hash(
          password,
          await bcrypt.genSalt(12),
        );

        client.user
          .create({ data: { ...rest, email, password: hashedPassword } })
          .then(({ id }) => {
            const token = jwt.sign({ userId: id } as JwtPayload, JWT_SECRET);

            req.session.user = { id, token };
            req.session
              .save()
              .then(() => res.status(200).json({}))
              .catch(() =>
                res.status(500).json({ err: 'Internal server error' }),
              )
              .finally(resolve);
          })
          .catch((reason) => {
            res.status(400).send({ err: reason });
            resolve();
          });
      }
    } else {
      res.status(400).end();
      resolve();
    }
  });
};

export default withSession(handler);
