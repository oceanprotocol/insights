import React, { ReactElement } from 'react';
import Image from 'next/image';
import EthIcon from '../../../assets/eth.svg';
import PolygonIcon from '../../../assets/polygon.svg';
import MoonbeamIcon from '../../../assets/moonbeam.svg';
import BscIcon from '../../../assets/bsc.svg';
import EnergywebIcon from '../../../assets/energyweb.svg';
import styles from './index.module.scss';

export default function NetworkIcon({ name }: { name: string }): any {
  switch (name) {
    case 'ETH':
      return (
        <Image
          src={EthIcon}
          alt="EthIcon"
          className={styles.icon}
          width={20}
          height={20}
        />
      );
    case 'Polygon':
    case 'Mumbai':
      return (
        <Image
          src={PolygonIcon}
          alt="PolygonIcon"
          className={styles.icon}
          width={20}
          height={20}
        />
      );
    case 'Moon':
      return (
        <Image
          src={MoonbeamIcon}
          alt="MoonbeamIcon"
          className={styles.icon}
          width={20}
          height={20}
        />
      );
    case 'BSC':
      return (
        <Image
          src={BscIcon}
          alt="BscIcon"
          className={styles.icon}
          width={20}
          height={20}
        />
      );
    case 'Energy Web':
      return (
        <Image
          src={EnergywebIcon}
          alt="EnergywebIcon"
          className={styles.icon}
          width={20}
          height={20}
        />
      );
    default:
      return (
        <Image
          src={EthIcon}
          alt="EthIcon"
          className={styles.icon}
          width={20}
          height={20}
        />
      );
  }
}
