import React, { ReactNode, useContext } from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthContext, AuthProvider } from '../app/contexts/auth-context';
import { LoadingOverlay } from '@mantine/core';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLoader>
          <Component {...pageProps} />
        </AppLoader>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const AppLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { loading, user } = useContext(AuthContext);
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
