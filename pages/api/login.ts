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

export type LoginHandler = Handler<{
  request: {
    check?: boolean;
    email?: string;
    password?: string;
  };
  response: {
    id?: number;
    name?: string;
  };
}>;

const handler: ApiHandler<API.Login> = async (req, res) => {
  return new Promise(async (resolve) => {
    if (req.method === 'POST') {
      try {
        if (req.body.check || req.session.user) {
          if (req.session.user) {
            const { id, token } = req.session.user;
            const matchingUser = await client.user.findUnique({
              where: { id },
            });
            const { userId } = jwt.verify(
              token,
              process.env.JWT_SECRET as string,
            ) as JwtPayload;

            if (matchingUser && userId === matchingUser.id) {
              res
                .status(200)
                .json({ id: matchingUser.id, name: matchingUser.name });
            } else {
              res.status(200).json({});
            }
          } else {
            res.status(200).json({});
          }

          resolve();
        } else {
          const { email, password } = req.body;

          if (email && password) {
            const user = await client.user.findUnique({ where: { email } });

            if (user) {
              const passwordCheck = await bcrypt.compare(
                password,
                user.password,
              );

              if (passwordCheck) {
                const token = jwt.sign(
                  { userId: user.id } as JwtPayload,
                  JWT_SECRET,
                );

                req.session.user = {
                  id: user.id,
                  token,
                };
                await req.session.save();

                res.status(200).json({ id: user.id, name: user.name });
              } else {
                res.status(200).json({ err: 'Wrong e-mail or password' });
              }
            } else {
              res.status(200).json({
                err: 'A user with this e-mail address does not exist',
              });
            }

            resolve();
          } else {
            res.status(400).json({ err: 'E-mail or password cannot be empty' });
          }

          resolve();
        }
      } catch (e) {
        res.status(500).json({ err: 'Internal server error' });
        resolve();
      }
    } else {
      res.status(400).end();
      resolve();
    }
  });
};

export default withSession(handler);
