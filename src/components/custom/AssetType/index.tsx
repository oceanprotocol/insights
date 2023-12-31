import React, { ReactElement } from 'react';
import Image from 'next/image';
import styles from './index.module.css';
import Compute from '../../../assets/compute.svg';
import Download from '../../../assets/download.svg';
import Lock from '../../../assets/lock.svg';

export default function AssetType({
  type,
  accessType,
  className,
}: {
  type: string;
  accessType: string;
  className?: string;
}): ReactElement {
  return (
    <div className={className || null}>
      {accessType === 'access' ? (
        <Image
          src={Download}
          alt="download"
          role="img"
          aria-label="Download"
          className={styles.icon}
        />
      ) : accessType === 'compute' && type === 'algorithm' ? (
        <Image
          src={Lock}
          alt="lock"
          role="img"
          aria-label="Private"
          className={styles.icon}
        />
      ) : (
        <Image
          src={Compute}
          alt="compute"
          role="img"
          aria-label="Compute"
          className={styles.icon}
        />
      )}

      <div className={styles.typeLabel}>
        {type === 'dataset' ? 'dataset' : 'algorithm'}
      </div>
    </div>
  );
}
