import client from '../../utils/database';
import { API, ApiHandler, Handler, withSession } from '../../utils/api';

export type NoteHandler = Handler<{
  request: {
    uid?: string;
    content?: string | null;
  };
  response: {
    uid?: string;
    content?: string | null;
  };
}>;

const handler: ApiHandler<API.Note> = async (req, res) => {
  return new Promise(async (resolve) => {
    if (req.session.user) {
      try {
        switch (req.method) {
          case 'PUT': {
            const { uid, content } = await client.note.create({
              data: {
                userId: req.session.user.id,
                content: '',
              },
            });

            res.status(200).json({ uid, content });
            break;
          }
          case 'POST': {
            const { uid } = req.body;
            const notes = await client.note.findMany({
              where: {
                userId: req.session.user.id,
                uid,
              },
            });

            const currentNote = notes[0];

            if (currentNote) {
              res
                .status(200)
                .json({ uid: currentNote.uid, content: currentNote.content });
            } else {
              res.status(404).end();
            }

            break;
          }
          case 'PATCH': {
            const { uid: targetUid, content: noteContent } = req.body;
            const notes = await client.note.updateMany({
              where: {
                userId: req.session.user.id,
                uid: targetUid,
              },
              data: {
                content: noteContent,
              },
            });

            res.status(200).end();
            break;
          }
          case 'DELETE': {
            const { uid: targetUid } = req.body;
            await client.note.deleteMany({
              where: {
                userId: req.session.user.id,
                uid: targetUid,
              },
            });
            res.status(200).end();
            break;
          }
          default: {
            res.status(400).end();
            break;
          }
        }

        resolve();
      } catch (e) {
        console.log(e);
        res.status(500).json({ err: 'Internal server error' });
        resolve();
      }
    } else {
      res.status(403).end();
      resolve();
    }
  });
};

export default withSession(handler);
