import React from "react";
import { NextPage } from "next";
import Image from "next/image";
import cs from "classnames";

import style from "./style.module.scss";

import WalletPortrait from "../../../assets/profile_logo.svg";
import CopyBtnImg from "../../../assets/icons8-copy-30.png";
import externalLink from "../../../assets/right-up.svg";
import { truncateWalletAddress } from "../../../shared/utilities/truncateAddress";
import useProfile from "./useProfile";
import { useAccount, useEnsAvatar } from 'wagmi';
import Copy from '../../../components/custom/Copy';
import Avatar from '../../custom/Avatar';

const Address: NextPage = () => {
  const { ExplorerLinks } = useProfile();
  const { address } = useAccount();

  const { data: accountEnsAvatar } = useEnsAvatar({
    address: address,
    chainId: 1,
  });

  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mb-2 mb-md-5">
      {address ? (
        <Avatar
          accountId={address}
          src={accountEnsAvatar}
          className={style.profileAvatar}
        />
      ) : (
        <Image src={WalletPortrait} alt="Wallet Portrait" />
      )}
      <div className="d-flex flex-column align-items-center align-items-md-start mt-4 mt-md-0 ms-0 ms-md-3 text-white">
        {address ? (
          <div className="d-flex flex-row justify-content-start playBold30 colorRaisinBlack text-white">
            {truncateWalletAddress(address, 4)}
            <Copy text={address} />
          </div>
        ) : (
          ''
        )}
        <div className="play15 mt-2">{address || ''}</div>
        <div
          className={cs(
            style.linkBox,
            'd-flex flex-row justify-content-center justify-content-md-start flex-wrap'
          )}
        >
          {ExplorerLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex flex-row align-items-center text-white clean-empty-hyperlink ms-2 ms-md-0 me-2 me-md-3 mt-3"
            >
              <Image src={link.logo} alt="ethereum logo" />
              <div className="poppins14 ms-1">{link.name}</div>
              <Image src={externalLink} alt="external up" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Address;
