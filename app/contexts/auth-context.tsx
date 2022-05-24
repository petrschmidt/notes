import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { API, post } from '../../utils/api';
import { useRouter } from 'next/router';
import { isEmptyObjectType } from 'tsutils';

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
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProps | undefined>();

  const {
    isLoading,
    data: { data } = {},
    isError,
    refetch,
  } = useQuery(API.Login, () => post(API.Login, { check: true }), {
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

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
    if (!isLoading && !user) {
      router.replace('/login').then().catch();
    }
  }, [user, isLoading]);

  return (
    <AuthContext.Provider
      value={{ user, loading: isLoading, refresh: refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};
