import React from "react";
import { NextPage } from "next";
import Image from 'next/image';

import style from './style.module.scss';

import WalletPortrait from '../../../assets/profile_logo.svg';
import { truncateWalletAddress } from '../../../shared/utilities/truncateAddress';
import { useEnsAvatar } from 'wagmi';
import Copy from '../../../components/custom/Copy';
import Avatar from '../../custom/Avatar';
import { useWalletContext } from '../../../shared/@ocean/context/WalletContext';

const Address: NextPage = () => {
  const { user } = useWalletContext();

  const { data: accountEnsAvatar } = useEnsAvatar({
    name: user,
    chainId: 1,
  });

  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-2 mb-md-5">
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
          <div className="d-flex flex-row justify-content-start playBold30 colorRaisinBlack text-white">
            {truncateWalletAddress(user, 4)}
            <Copy text={user} />
          </div>
        ) : (
          'Please connect your wallet.'
        )}
        <div className="play15 mt-2">{user || ''}</div>
      </div>
    </div>
  );
};

export default Address;
