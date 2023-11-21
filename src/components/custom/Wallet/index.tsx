import React, { ReactElement } from 'react';
import Account from './Account';
import styles from './index.module.scss';
import Tooltip from '../Tooltip';
import Details from './Details';
import Network from './Network';
import { useUser } from '../../../shared/@ocean/context/UserContext';

type WalletPropType = {
  mobile?: boolean;
};

export default function Wallet({ mobile }: WalletPropType): ReactElement {
  const { user } = useUser();

  return (
    <div
      className={
        (styles.wallet,
        'd-flex flex-row justify-content-center align-items-center w-100 h-100 me-0 me-md-3 order-1 order-md-1')
      }
    >
      <Network />
      <Tooltip
        content={<Details />}
        trigger="click focus"
        disabled={!user}
        className="h-100"
      >
        <Account mobile={mobile} />
      </Tooltip>
    </div>
  );
}
