import React, { ReactElement } from 'react';
import Image from 'next/image';
import cs from 'classnames';
import styles from './Details.module.scss';
import Button from '../Button';
import MetamaskLogo from '../../../assets/MetaMask_Fox.svg';
import MagicLinkLogo from '../../../assets/magic_color.svg';
import CoinbaseLogo from '../../../assets/coinbase-wallet-logo.svg';
import { formatNumber } from '../../../shared/utilities/format';
import BigNumber from 'bignumber.js';
import useBalance from '../../../shared/@ocean/hooks/useBalance';
import { truncateWalletAddress } from '@/shared/utilities/truncateAddress';
import { useWeb3 } from '../../../shared/@ocean/context/WalletContext';
import { useUser } from '../../../shared/@ocean/context/UserContext';
import CopyButton from '../../../assets/copy.png';

export default function Details(): ReactElement {
  const { handleDisconnect, handleConnect, walletConnectionType } = useWeb3();
  const { user } = useUser();
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
              {walletConnectionType?.walletType === 'metamask' && (
                <Image
                  className={styles.walletLogo}
                  src={MetamaskLogo}
                  alt="metamask logog"
                />
              )}
              {walletConnectionType?.walletType === 'magic' && (
                <Image
                  className={styles.walletLogo}
                  src={MagicLinkLogo}
                  alt="metamask logog"
                />
              )}
              {walletConnectionType?.walletType === 'coinbase_wallet' && (
                <Image
                  className={styles.walletLogo}
                  src={CoinbaseLogo}
                  alt="metamask logog"
                />
              )}
            </span>
            <div
              className={styles.address}
              onClick={() => {
                navigator.clipboard.writeText(user);
              }}
            >
              {truncateWalletAddress(user || '', user ? 4 : 0)}{' '}
              <Image
                width={12}
                height={12}
                src={CopyButton}
                alt="copy_button"
              />
            </div>
          </div>
          <p>
            <Button
              className={cs(
                styles.magentaText,
                styles.mb_3,
                'clean-empty-button'
              )}
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
