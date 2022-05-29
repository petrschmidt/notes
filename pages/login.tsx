import { useForm, yupResolver } from '@mantine/form';
import {
  Alert,
  Anchor,
  Button,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import * as y from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import { getMetaTitle } from '../utils/helpers';
import { API, post } from '../utils/api';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../app/contexts/auth-context';

type FormData = {
  email: string;
  password: string;
};

const schema = y.object({
  email: y.string().required('E-mail is required').email('Invalid email'),
  password: y.string().required('Password is required'),
});

const Login = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  const {
    data: { data } = {},
    mutate,
    isLoading,
  } = useMutation({ mutationFn: (data: FormData) => post(API.Login, data) });

  useEffect(() => {
    authContext.refresh();

    if (authContext.user) {
      router.replace('/').then();
    }
  }, [authContext, data]);

  const { onSubmit, getInputProps, validate } = useForm<FormData>({
    schema: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = ({ email, password }: FormData) => {
    const { hasErrors } = validate();

    if (!hasErrors) {
      mutate({ email, password });
    }
  };

  return (
    <>
      <Head>
        <title>{getMetaTitle('Login')}</title>
      </Head>
      <Container size={460} my={30}>
        <Title align='center'>Welcome back!</Title>

        <Text color='dimmed' size='sm' align='center' mt={5}>
          Don&apos;t have an account?{' '}
          <Link href='/register' passHref>
            <Anchor<'a'> size='sm'>Create a new account</Anchor>
          </Link>
        </Text>

        <Paper
          withBorder
          shadow='lg'
          p={30}
          mt={30}
          radius='md'
          style={{ position: 'relative' }}
        >
          <LoadingOverlay visible={isLoading} />

          <form onSubmit={onSubmit((values) => handleSubmit(values))}>
            <TextInput
              label='E-mail'
              placeholder='your@email.com'
              mt='md'
              {...getInputProps('email')}
            />
            <PasswordInput
              label='Password'
              placeholder='Your password'
              mt='md'
              {...getInputProps('password')}
            />

            {Object.keys(data || {}).includes('err') && (
              <Alert title='Error' color='red' mt='md'>
                {/* @ts-ignore */}
                {data.err}
              </Alert>
            )}

            <Button type='submit' fullWidth mt='xl' disabled={isLoading}>
              Log In
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
