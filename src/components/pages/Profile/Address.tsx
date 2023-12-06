import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';

import style from './style.module.scss';

import WalletPortrait from '../../../assets/profile_logo.svg';
import { truncateWalletAddress } from '../../../shared/utilities/truncateAddress';
import { useEnsAvatar } from 'wagmi';
import Copy from '../../../components/custom/Copy';
import Avatar from '../../custom/Avatar';
import { useWalletContext } from '../../../shared/@ocean/context/WalletContext';
import { useProfile } from '../../../shared/@ocean/context/Profile';
import { LoggerInstance } from '@oceanprotocol/lib';
import config from '../../../../config';

const Address: NextPage = () => {
  const { user } = useWalletContext();

  const { data: accountEnsAvatar } = useEnsAvatar({
    name: user,
    chainId: 1,
  });

  const { assets, assetsTotal, sales } = useProfile();

  const [totalSales, setTotalSales] = useState(0);

  const chainIds = config.oceanApp.chainIds;

  useEffect(() => {
    if (!assets || !user || !chainIds) return;

    async function getPublisherTotalSales() {
      try {
        let count = 0;
        for (const priceInfo of assets) {
          if (priceInfo?.stats?.price?.value && priceInfo.stats.orders > 0) {
            count += priceInfo.stats.price.value * priceInfo.stats.orders;
          }
        }
        setTotalSales(count);
      } catch (error) {
        LoggerInstance.error(error.message);
      }
    }
    getPublisherTotalSales();
  }, [assets, user, chainIds]);

  const UsetStats = () => (
    <div className="d-flex flex-row justify-content-between col-12 col-md-4">
      <div className="d-flex flex-md-row w-100 mt-2 mt-md-5 text-white">
        <div
          className={
            'd-flex flex-column justify-content-center align-items-center col-4'
          }
        >
          <div className="play20">
            {totalSales} <span className="play0">€</span>
          </div>
          <div className="play10">Total Sales</div>
        </div>
        <div
          className={
            'd-flex flex-column justify-content-center align-items-center col-4'
          }
        >
          <div className="play20">{sales}</div>
          <div className="play10">Sales</div>
        </div>
        <div
          className={
            'd-flex flex-column justify-content-center align-items-center col-4'
          }
        >
          <div className="play20">{assetsTotal}</div>
          <div className="play10">Published</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 mb-md-5 mt-5 w-100">
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mt-5">
        {user ? (
          <Avatar
            accountId={user}
            src={accountEnsAvatar}
            className={style.profileAvatar}
          />
        ) : (
          <Image
            src={WalletPortrait}
            width={96}
            height={96}
            alt="Wallet Portrait"
          />
        )}
        <div className="d-flex flex-column align-items-center align-items-md-start mt-4 mt-md-0 ms-0 ms-md-3 text-white">
          {user ? (
            <div className="d-flex flex-row justify-content-start play20 colorRaisinBlack text-white gap14">
              {truncateWalletAddress(user, 4)}
              <Copy text={user} />
            </div>
          ) : (
            'Please connect your wallet.'
          )}
        </div>
      </div>
      <UsetStats />
    </div>
  );
};

export default Address;
