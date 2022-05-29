import React, { ReactNode, useContext, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthContext, AuthProvider } from '../app/contexts/auth-context';
import { LoadingOverlay } from '@mantine/core';
import '../app/styles/base.css';
import { useRouter } from 'next/router';
import { NotificationsProvider } from '@mantine/notifications';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotificationsProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppLoader>
            <Component {...pageProps} />
          </AppLoader>
        </AuthProvider>
      </QueryClientProvider>
    </NotificationsProvider>
  );
}

const AppLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { loading, user } = useContext(AuthContext);
  const router = useRouter();
  const showLoader = !user && loading;

  return (
    <>
      <LoadingOverlay
        transitionDuration={500}
        visible={showLoader}
        overlayOpacity={1}
      />
      {!showLoader && children}
    </>
  );
};

export default MyApp;
