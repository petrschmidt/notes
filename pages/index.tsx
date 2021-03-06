import { useContext, useEffect, useState } from 'react';
import {
  AppShell,
  Burger,
  Header,
  Text,
  MediaQuery,
  Navbar,
  useMantineTheme,
  Divider,
  Button,
  Title,
} from '@mantine/core';
import type { NextPage } from 'next';
import Head from 'next/head';
import { getMetaTitle } from '../utils/helpers';
import { useQuery } from 'react-query';
import { API } from '../utils/api';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../app/contexts/auth-context';
import { NoteListingItem } from '../app/components/note-listing-item';
import { showNotification } from '@mantine/notifications';
import { useRichTextEditor } from '../app/hooks/use-rich-text-editor';
import { ButtonLink } from '../app/components/button-link';

const MAX_TITLE_LENGTH = 30;

type ControlsState = {
  create?: boolean;
  save?: boolean;
  delete?: boolean;
};

const Home: NextPage = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);
  const [initialEditorValue, setInitialEditorValue] = useState('');
  const [editorLoading, setEditorLoading] = useState(false);
  const [controlsLoading, setControlsLoading] = useState<ControlsState>({});

  const noteUid: string = (router.query?.n as string) ?? '';

  const {
    data: { data: notesData } = {},
    isLoading: notesLoading,
    refetch: refetchNotes,
  } = useQuery(API.NoteList, () =>
    axios({
      url: API.NoteList,
      method: 'GET',
    }),
  );

  useEffect(() => {
    if (noteUid) {
      setEditorLoading(true);

      axios({
        url: API.Note,
        method: 'POST',
        data: {
          uid: noteUid,
        },
      })
        .then((res) => {
          setInitialEditorValue(res.data?.content);
        })
        .catch(() =>
          showNotification({
            title: 'Error',
            color: 'red',
            message:
              'An error has occurred while loading note. Please, try again.',
          }),
        )
        .finally(() => setEditorLoading(false));
    }
  }, [setInitialEditorValue, noteUid]);

  const createNote = () => {
    setControlsLoading((prev) => ({ ...prev, create: true }));

    axios({
      url: API.Note,
      method: 'PUT',
    })
      .then(async (res) => {
        await refetchNotes();
        await router.push({
          pathname: '/',
          query: {
            n: res.data?.uid,
          },
        });
      })
      .catch(() =>
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            'An error has occurred while creating new note. Please, try again.',
        }),
      )
      .finally(() =>
        setControlsLoading((prev) => ({ ...prev, create: false })),
      );
  };

  const saveNote = () => {
    if (!noteUid) return;

    setControlsLoading((prev) => ({ ...prev, save: true }));

    axios({
      url: API.Note,
      method: 'PATCH',
      data: {
        uid: noteUid,
        title: getEditorText().substring(0, MAX_TITLE_LENGTH),
        content: getEditorValue(),
      },
    })
      .then(async () => {
        await refetchNotes();
      })
      .catch(() =>
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            'An error has occurred while saving note. Please, try again.',
        }),
      )
      .finally(() => setControlsLoading((prev) => ({ ...prev, save: false })));
  };

  const deleteNote = () => {
    if (!noteUid) return;

    setControlsLoading((prev) => ({ ...prev, delete: true }));

    axios({
      url: API.Note,
      method: 'DELETE',
      data: {
        uid: noteUid,
      },
    })
      .then(async () => {
        await refetchNotes();
        await router.replace('/');
      })
      .catch(() =>
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            'An error has occurred while deleting note. Please, try again.',
        }),
      )
      .finally(() =>
        setControlsLoading((prev) => ({ ...prev, delete: false })),
      );
  };

  const { editor, getEditorValue, getEditorText } = useRichTextEditor({
    value: initialEditorValue,
    loading: notesLoading || editorLoading,
    disabled: !noteUid,
    disabledPlaceholder: (
      <>
        Select a note, or{' '}
        <ButtonLink onClick={createNote}>create a new one</ButtonLink>
      </>
    ),
  });

  return (
    <>
      <Head>
        <title>{getMetaTitle('Home')}</title>
      </Head>
      <AppShell
        styles={{
          main: {
            background: theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint='sm'
        fixed
        padding={0}
        navbar={
          <Navbar
            p='md'
            hiddenBreakpoint='sm'
            hidden={!opened}
            width={{ sm: 200, lg: 300 }}
          >
            <Navbar.Section grow>
              <Button
                variant='light'
                color='blue'
                fullWidth
                mb='xl'
                onClick={createNote}
                loading={controlsLoading.create}
                disabled={controlsLoading.create}
              >
                Create new
              </Button>
              <Divider ml='xs' label='My Notes' size={0} />
              {notesData?.notes.map((note: any) => (
                <NoteListingItem
                  key={note.uid}
                  to={`/?n=${note.uid}`}
                  active={noteUid === note.uid}
                >
                  {note.title}
                </NoteListingItem>
              ))}
            </Navbar.Section>
            <Divider my='md' />
            <Navbar.Section>
              <Text size='xs' align='center' color='dimmed'>
                UHK FIM (OWE) &copy; {new Date().getFullYear()} Petr Schmidt
              </Text>
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={70} p='md'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size='sm'
                  color={theme.colors.gray[6]}
                  mr='xl'
                />
              </MediaQuery>
              <Title
                order={3}
                sx={{
                  color: theme.colors.blue[6],
                }}
              >
                Notes
              </Title>
              <div style={{ marginLeft: 'auto' }}>
                {noteUid && (
                  <>
                    <Button
                      variant='light'
                      sx={{
                        borderBottomRightRadius: 0,
                        borderTopRightRadius: 0,
                      }}
                      onClick={saveNote}
                      loading={controlsLoading.save}
                      disabled={controlsLoading.save}
                    >
                      Save
                    </Button>
                    <Button
                      variant='light'
                      color='red'
                      sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                      onClick={deleteNote}
                      loading={controlsLoading.delete}
                      disabled={controlsLoading.delete}
                    >
                      Delete
                    </Button>
                  </>
                )}
                <Button
                  ml='xl'
                  color='gray'
                  variant='subtle'
                  onClick={authContext.logout}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </Header>
        }
      >
        {editor}
      </AppShell>
    </>
  );
};

export default Home;
