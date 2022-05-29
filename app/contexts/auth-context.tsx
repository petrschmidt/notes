import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { API, post } from '../../utils/api';
import { useRouter } from 'next/router';
import axios from 'axios';

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
        //await router.replace('/login');
      })
      .catch(() => console.log('Error while logging out'));
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
