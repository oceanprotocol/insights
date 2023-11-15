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
import { useWeb3 } from '../../../shared/@ocean/context/WalletContext';
import { magic } from '../../../shared/utilities/libs/magic';
import { useUser } from '../../../shared/@ocean/context/UserContext';

export default function Details(): ReactElement {
  const { connect, connectors } = useConnect();
  const { connector: activeConnector, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance: wagmiBalance } = useBalance();

  const { handleDisconnect, web3 } = useWeb3();
  const { user } = useUser();

  const [balance, setBalance] = useState('...');

  // Call the getBalance function when the user state variable changes
  useEffect(() => {
    const getBalance = async () => {
      if (!user || !web3) return;
      try {
        // If account and web3 are available, get the balance
        const balance = await web3.eth.getBalance(user);

        // Convert the balance from Wei to Ether and set the state variable
        setBalance(web3.utils.fromWei(balance).substring(0, 7));
      } catch (error) {
        console.error(error);
      }
    };

    getBalance();
  }, [user]);

  return (
    <div className={styles.details}>
      <ul>
        {Object.entries(wagmiBalance).map(([key, value]) => (
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
            <span
              className={styles.address}
              onClick={() => {
                navigator.clipboard.writeText(address);
              }}
            >
              {truncateWalletAddress(address || '', address ? 4 : 0)}
            </span>
          </div>
          <p>
            <Button
              className={cs(styles.magentaText, 'clean-empty-button')}
              onClick={async () => {
                connect({ connector: connectors[0] });
              }}
            >
              Switch Wallet
            </Button>
            <Button
              className={cs(styles.magentaText, 'clean-empty-button')}
              onClick={() => {
                handleDisconnect();
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
