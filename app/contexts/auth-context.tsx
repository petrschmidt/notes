import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { API, post } from '../../utils/api';
import { useRouter } from 'next/router';
import axios from 'axios';
import { showNotification } from '@mantine/notifications';

type UserProps = {
  id: number;
  name: string;
};

export const AuthContext = createContext({
  user: {
    id: 1,
    name: '',
  } as UserProps | undefined,
  loading: false,
  refresh: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>();
  const [loading, setLoading] = useState(true);

  const {
    isLoading,
    data: { data } = {},
    isError,
    refetch,
  } = useQuery(API.Login, () => post(API.Login, { check: true }), {
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  const logout = () => {
    axios
      .get(API.Logout)
      .then(async () => {
        await refetch();
        setUser(undefined);
      })
      .catch(() =>
        showNotification({
          title: 'Error',
          color: 'red',
          message: 'An error occurred while logging out. Please, try again.',
        }),
      );
  };

  useEffect(() => {
    if (!isError && data) {
      //@ts-ignore
      if (!data?.err && data?.id && data?.name) {
        setUser(data as UserProps);
        return;
      }
    }

    setUser(undefined);
  }, [data, isError]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login').then().catch();
    }
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh: refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
