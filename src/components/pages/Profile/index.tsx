import React from 'react';
import { NextPage } from 'next';
import cs from 'classnames';

import style from './style.module.scss';

import Address from './Address';
import HistoryPage from './History/index';
import { useWalletContext } from '../../../shared/@ocean/context/WalletContext';

const Profile: NextPage = () => {
  const { user } = useWalletContext();

  return (
    <div
      className={cs(
        style.container,
        'd-flex flex-column justify-content-between justify-content-md-start align-items-center'
      )}
    >
      <Address />
      <HistoryPage accountIdentifier={user} />
    </div>
  );
};

export default Profile;
