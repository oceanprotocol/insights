import React from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from "next-i18next";
import { ChakraProvider } from '@chakra-ui/react';
import { ConnectKitProvider } from 'connectkit';
import { WagmiConfig } from 'wagmi';

import '../styles/globals.scss';

import Layout from '../components/custom/Layout';
import UrqlProvider from '../shared/@ocean/context/UrqlProvider';
import { wagmiClient } from '../shared/utilities/wallet';
import { UserPreferencesProvider } from '../shared/@ocean/context/UserPreferences';
import MarketMetadataProvider from '../shared/@ocean/context/MarketMetadata';
import { Web3Provider } from '../shared/@ocean/context/Web3Context';
import { UserProvider } from '../shared/@ocean/context/UserContext';

export function App({ Component, pageProps }: AppProps) {
  return (
    // <ChakraProvider>
    <Web3Provider>
      <UserProvider>
        <WagmiConfig client={wagmiClient}>
          <ConnectKitProvider theme="auto" mode="dark">
            <MarketMetadataProvider>
              <UrqlProvider>
                <UserPreferencesProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </UserPreferencesProvider>
              </UrqlProvider>
            </MarketMetadataProvider>
          </ConnectKitProvider>
        </WagmiConfig>
      </UserProvider>
    </Web3Provider>
    // </ChakraProvider>
  );
}

export default appWithTranslation(App);
