import React, { ReactElement } from 'react';
import Caret from '../../../assets/caret.svg';
import CaretBlack from '../../../assets/caret_black.svg';
import styles from './Account.module.scss';
import { useEnsName, useEnsAvatar } from 'wagmi';
import Image from 'next/image';
import Avatar from '../Avatar';
import { truncateWalletAddress } from '../../../shared/utilities/truncateAddress';
import { useWalletContext } from '../../../shared/@ocean/context/WalletContext';

type AccountPropType = {
  mobile?: boolean;
};

// Forward ref for Tippy.js
// eslint-disable-next-line
export default function Account({ mobile }: AccountPropType): ReactElement {
  const { user } = useWalletContext();
  const { data: accountEns } = useEnsName({
    address: user as `0x${string}`,
    chainId: 1,
  });
  const { data: accountEnsAvatar } = useEnsAvatar({
    chainId: 1,
    name: user,
  });

  return (
    user && (
      <button
        className={styles.button}
        aria-label="Account"
        onClick={(e) => e.preventDefault()}
      >
        <Avatar accountId={user} src={accountEnsAvatar} />
        <span className={styles.address} title={user}>
          {truncateWalletAddress(accountEns || user, mobile ? 12 : 4)}
        </span>
        {mobile ? (
          <Image
            src={CaretBlack}
            alt="caret"
            className={styles.caret}
            aria-hidden="true"
          />
        ) : (
          <Image
            src={Caret}
            alt="caret"
            className={styles.caret}
            aria-hidden="true"
          />
        )}
      </button>
    )
  );
}
