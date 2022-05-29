import { API, ApiHandler, Handler, withSession } from '../../utils/api';

export type LogoutHandler = Handler<{
  request: {};
  response: {};
}>;

const handler: ApiHandler<API.Login> = async (req, res) => {
  return new Promise(async (resolve) => {
    if (req.method === 'GET') {
      if (req.session?.user) {
        req.session.destroy();
      }

      res.status(200).end();
      resolve();
    } else {
      res.status(400).end();
      resolve();
    }
  });
};

export default withSession(handler);
