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
import { useState } from 'react';

type FormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const schema = y.object({
  name: y
    .string()
    .required('Name is required')
    .min(3, 'Name should have at least 3 characters'),
  email: y.string().required('E-mail is required').email('Invalid email'),
  password: y
    .string()
    .required('Password is required')
    .min(8, 'Password must have at least 8 characters'),
  passwordConfirmation: y
    .string()
    .required('Password confirmation is required')
    .oneOf([y.ref('password'), null], 'Passwords must match'),
});

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { onSubmit, getInputProps, validate, validateField } =
    useForm<FormData>({
      schema: yupResolver(schema),
      initialValues: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
    });

  const handleSubmit = ({ name, email, password }: FormData) => {
    setLoading(true);
    const { hasErrors } = validate();

    if (hasErrors) return;

    post(API.Register, { name, email, password })
      .then(() => router.replace('/'))
      .catch(({ response }) => setError(response.data.err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Head>
        <title>{getMetaTitle('Register')}</title>
      </Head>
      <Container size={460} my={30}>
        <Title align='center'>Create Account</Title>

        <Text color='dimmed' size='sm' align='center' mt={5}>
          Already have an account?{' '}
          <Link href='/login' passHref>
            <Anchor<'a'> size='sm'>Log in</Anchor>
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
          <LoadingOverlay visible={loading} />

          <form onSubmit={onSubmit((values) => handleSubmit(values))}>
            <TextInput
              label='Name'
              placeholder='John'
              {...getInputProps('name')}
            />
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
            <PasswordInput
              label='Repeat your password'
              placeholder='Your password'
              mt='md'
              {...getInputProps('passwordConfirmation')}
            />

            {error && (
              <Alert title='Error' color='red' mt='md'>
                {error}
              </Alert>
            )}

            <Button type='submit' fullWidth mt='xl' disabled={loading}>
              Create Account
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Register;
