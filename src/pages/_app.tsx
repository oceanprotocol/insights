import React from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from "next-i18next";
import { WagmiConfig } from 'wagmi';

import '../styles/globals.scss';

import Layout from '../components/custom/Layout';
import UrqlProvider from '../shared/@ocean/context/UrqlProvider';
import { wagmiClient } from '../shared/utilities/wallet';
import MarketMetadataProvider from '../shared/@ocean/context/MarketMetadata';
import { Web3Provider } from '../shared/@ocean/context/WalletContext';

export function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiClient}>
      <Web3Provider>
        <MarketMetadataProvider>
          <UrqlProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UrqlProvider>
        </MarketMetadataProvider>
      </Web3Provider>
    </WagmiConfig>
  );
}

export default appWithTranslation(App);
