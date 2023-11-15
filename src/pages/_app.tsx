import React from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from "next-i18next";
import { WagmiConfig } from 'wagmi';

import '../styles/globals.scss';

import Layout from '../components/custom/Layout';
import UrqlProvider from '../shared/@ocean/context/UrqlProvider';
import { wagmiClient } from '../shared/utilities/wallet';
import { UserPreferencesProvider } from '../shared/@ocean/context/UserPreferences';
import MarketMetadataProvider from '../shared/@ocean/context/MarketMetadata';
import { Web3Provider } from '../shared/@ocean/context/WalletContext';
import { UserProvider } from '../shared/@ocean/context/UserContext';

export function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiClient}>
      <Web3Provider>
        <UserProvider>
          <MarketMetadataProvider>
            <UrqlProvider>
              <UserPreferencesProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </UserPreferencesProvider>
            </UrqlProvider>
          </MarketMetadataProvider>
        </UserProvider>
      </Web3Provider>
    </WagmiConfig>
  );
}

export default appWithTranslation(App);
