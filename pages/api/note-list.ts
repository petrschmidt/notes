import client from '../../utils/database';
import { API, ApiHandler, Handler, withSession } from '../../utils/api';
import { stripHtml } from '../../utils/helpers';

export type NoteListHandler = Handler<{
  request: {};
  response: {
    notes: {
      content?: string | null;
    }[];
  };
}>;

const handler: ApiHandler<API.NoteList> = async (req, res) => {
  return new Promise(async (resolve) => {
    if (req.method === 'GET') {
      if (req.session.user) {
        try {
          const notes = await client.note.findMany({
            where: {
              userId: req.session.user.id,
            },
            orderBy: {
              updatedAt: 'desc',
            },
          });

          res.status(200).json({
            notes: notes.map((note) => ({
              ...note,
              content: stripHtml(note.content?.substring(0, 30) ?? ''),
            })),
          });
          resolve();
        } catch (e) {
          res.status(500).json({ err: 'Internal server error' });
          resolve();
        }
      } else {
        res.status(403).end();
        resolve();
      }
    } else {
      res.status(400).end();
      resolve();
    }
  });
};

export default withSession(handler);
