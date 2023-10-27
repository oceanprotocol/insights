import React, { ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDisconnect, useAccount, useConnect } from 'wagmi';
import cs from 'classnames';
import styles from './Details.module.scss';
import Button from '../Button';
import MetamaskLogo from '../../../assets/MetaMask_Fox.svg';
import WalletConnectLogo from '../../../assets/walletconnect-seeklogo.com.svg';
import CoinbaseLogo from '../../../assets/coinbase-wallet-logo.svg';
import { formatNumber } from '../../../shared/utilities/format';
import BigNumber from 'bignumber.js';
import useBalance from '../../../shared/@ocean/hooks/useBalance';
import { truncateWalletAddress } from '@/shared/utilities/truncateAddress';

export default function Details(): ReactElement {
  const { connect, connectors } = useConnect();
  const { connector: activeConnector, address} = useAccount();
  const { disconnect } = useDisconnect();
  const { balance } = useBalance();

  return (
    <div className={styles.details}>
      <ul>
        {Object.entries(balance).map(([key, value]) => (
          <li className={styles.balance} key={key}>
            <span className={styles.symbol}>{key.toUpperCase()}</span>
            <span className={styles.value}>
              {formatNumber(new BigNumber(value), 5)}
            </span>
          </li>
        ))}

        <li className={styles.actions}>
          <div title="Connected provider" className={styles.walletInfo}>
            <span className={styles.walletLogoWrap}>
              {activeConnector?.name === 'MetaMask' && (
                <Image
                  className={styles.walletLogo}
                  src={MetamaskLogo}
                  alt="metamask logog"
                />
              )}
              {activeConnector?.name === 'WalletConnectLegacy' && (
                <Image
                  className={styles.walletLogo}
                  src={WalletConnectLogo}
                  alt="metamask logog"
                />
              )}
              {activeConnector?.name === 'Coinbase Wallet' && (
                <Image
                  className={styles.walletLogo}
                  src={CoinbaseLogo}
                  alt="metamask logog"
                />
              )}
              {activeConnector?.name.replace('Legacy', '')}
            </span>
            <span className={styles.address} onClick={()=>{navigator.clipboard.writeText(address);}}>
                {truncateWalletAddress(address || '', (address)? 4: 0)}
            </span> 
          </div>
          <p>
            <Button
              className={cs(styles.magentaText, 'clean-empty-button')}
              onClick={async () => {
                connect({ connector: connectors[0] })}
              }
            >
              Switch Wallet
            </Button>
            <Button
              className={cs(styles.magentaText, 'clean-empty-button')}
              onClick={() => {
                disconnect();
                // location.reload();
              }}
            >
              Disconnect
            </Button>
          </p>
        </li>
      </ul>
    </div>
  );
}
