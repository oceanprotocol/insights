import React from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from "next-i18next";
import { WagmiConfig } from 'wagmi';

import '../styles/globals.scss';

import Layout from '../components/custom/Layout';
import UrqlProvider from '../shared/@ocean/context/UrqlProvider';
import { wagmiClient } from '../shared/utilities/wallet';
import MarketMetadataProvider from '../shared/@ocean/context/MarketMetadata';
import { EthersProvider } from '../shared/@ocean/context/WalletContext';

export function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiClient}>
      <EthersProvider>
        <MarketMetadataProvider>
          <UrqlProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UrqlProvider>
        </MarketMetadataProvider>
      </EthersProvider>
    </WagmiConfig>
  );
}

export default appWithTranslation(App);
