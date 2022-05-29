import { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import { API } from '../utils/api';
import axios from 'axios';
import { useRouter } from 'next/router';
import { AuthContext } from '../app/contexts/auth-context';
import { NavbarLink } from '../app/components/navbar-link';
import { showNotification } from '@mantine/notifications';
import type { Editor } from '@mantine/rte';

const RichTextEditor = dynamic(() => import('@mantine/rte'), { ssr: false });

const Home: NextPage = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const theme = useMantineTheme();

  const [opened, setOpened] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const editorRef = useRef<Editor>(null);

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
      axios({
        url: API.Note,
        method: 'POST',
        data: {
          uid: noteUid,
        },
      })
        .then((res) => {
          setEditorValue(res.data?.content);
        })
        .catch(() =>
          showNotification({
            title: 'Error',
            color: 'red',
            message:
              'An error has occurred while loading note. Please, try again.',
          }),
        );
    }
  }, [setEditorValue, noteUid]);

  useEffect(() => {
    console.log(editorRef.current);
    if (editorRef.current && editorRef.current.focus) {
      editorRef.current.focus();
    }
  }, [editorRef]);

  if (!authContext.user) {
    return null;
  }

  const createNote = () => {
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
      );
  };

  const saveNote = () => {
    axios({
      url: API.Note,
      method: 'PATCH',
      data: {
        uid: noteUid,
        content: editorValue,
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
      );
  };

  const deleteNote = () => {
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
      );
  };

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
                mb='md'
                onClick={createNote}
              >
                Create new
              </Button>
              {notesData?.notes.map((note: any) => (
                <NavbarLink
                  key={note.uid}
                  to={`/?n=${note.uid}`}
                  active={noteUid === note.uid}
                >
                  {note.content ?? '&nbsp;'}
                </NavbarLink>
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
                    >
                      Save
                    </Button>
                    <Button
                      variant='light'
                      color='red'
                      sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                      onClick={deleteNote}
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
        {noteUid && (
          <>
            <RichTextEditor
              ref={editorRef}
              value={editorValue}
              onChange={setEditorValue}
              placeholder='Write anything...'
              radius={0}
              style={{ border: 'none', height: '100%' }}
            />
          </>
        )}
      </AppShell>
    </>
  );
};

export default Home;
