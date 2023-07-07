import React, { ReactElement } from 'react';
import styles from './index.module.scss';
import NetworkIcon from './NetworkIcon';
import useNetworkMetadata, {
  getNetworkDataById,
  getNetworkDisplayName,
} from '../../../shared/@ocean/hooks/useNetworkMetadata';

export default function NetworkName({
  networkId,
  minimal,
  className,
}: {
  networkId: number;
  minimal?: boolean;
  className?: string;
}): ReactElement {
  const { networksList } = useNetworkMetadata();
  const networkData = getNetworkDataById(networksList, networkId);
  if (!networkData) {
    return <></>;
  }
  const networkName = getNetworkDisplayName(networkData);

  return (
    <span
      className={`${styles.network} ${minimal ? styles.minimal : null} ${
        className || ''
      }`}
      title={networkName}
    >
      <NetworkIcon name={networkName} />{' '}
      <span className={styles.name}>{networkName}</span>
    </span>
  );
}
