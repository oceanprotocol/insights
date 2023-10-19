import React from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from "next-i18next";
import { ConnectKitProvider } from 'connectkit';
import { WagmiConfig } from 'wagmi';

import '../styles/globals.scss';

import Layout from '../components/custom/Layout';
import UrqlProvider from '../shared/@ocean/context/UrqlProvider';
import { wagmiClient } from '../shared/utilities/wallet';
import { UserPreferencesProvider } from '../shared/@ocean/context/UserPreferences';
import MarketMetadataProvider from '../shared/@ocean/context/MarketMetadata';

export function App({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default appWithTranslation(App);
