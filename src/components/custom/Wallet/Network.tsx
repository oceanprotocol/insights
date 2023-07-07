import React, { ReactElement } from 'react';
import cs from 'classnames';
import styles from './Network.module.scss';
import { useNetwork } from 'wagmi';
import Tooltip from '../Tooltip';
import Status from '../Status';
import Badge from '../Badge';
import useNetworkMetadata from '../../../shared/@ocean/hooks/useNetworkMetadata';
import NetworkName from '../NetworkName';

export default function Network(): ReactElement {
  const { chain } = useNetwork();
  const { isTestnet, isSupportedOceanNetwork } = useNetworkMetadata();

  return chain?.id ? (
    <div className={cs(styles.network, 'h-100')}>
      {!isSupportedOceanNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      <NetworkName className={styles.name} networkId={chain.id} minimal />
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : (
    <></>
  );
}
