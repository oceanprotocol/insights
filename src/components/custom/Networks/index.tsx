import React, { ReactElement } from 'react';
import Image from 'next/image';

import { useUserPreferences } from '../../../shared/@ocean/context/UserPreferences';
import Caret from '../../../assets/caret.svg';
import Network from '../../../assets/network.svg';
import NetworksList from './NetworksList';
import styles from './index.module.scss';
import Label from '../Label/Label';
import Tooltip from '../Tooltip';
import FormHelp from '../Help/Help';
import useNetworkMetadata, {
  filterNetworksByType,
} from '../../../shared/@ocean/hooks/useNetworkMetadata';
import config from '../../../../config';

export default function Networks(): ReactElement {
  const { networksList } = useNetworkMetadata();
  const { chainIds } = useUserPreferences();
  const appConfig = config.oceanApp;

  const networksMain = filterNetworksByType(
    'mainnet',
    appConfig.chainIdsSupported,
    networksList
  );

  const networksTest = filterNetworksByType(
    'testnet',
    appConfig.chainIdsSupported,
    networksList
  );

  return (
    <Tooltip
      content={
        <ul className={styles.preferencesDetails}>
          <li>
            <Label htmlFor="chains">Networks</Label>
            <FormHelp>Switch the data source for the interface.</FormHelp>

            <NetworksList title="Main" networks={networksMain} />
            <NetworksList title="Test" networks={networksTest} />
          </li>
        </ul>
      }
      trigger="click focus"
      className={`${styles.preferences} ${styles.networks}`}
    >
      <>
        <Image src={Network} alt="network icon" className={styles.icon} />
        <Image
          src={Caret}
          alt="caret"
          className={styles.icon}
          width={18}
          height={18}
        />

        <div className={styles.chainsSelected}>
          {chainIds.map((chainId: any) => (
            <span className={styles.chainsSelectedIndicator} key={chainId} />
          ))}
        </div>
      </>
    </Tooltip>
  );
}
