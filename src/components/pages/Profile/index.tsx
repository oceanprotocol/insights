import React from 'react';
import { NextPage } from 'next';
import cs from 'classnames';

import style from './style.module.scss';

import Address from './Address';
import AssetsDetails from './AssetsDetails';
import ComputeHistory from './History'

const Profile: NextPage = () => {

  return (
    <div
      className={cs(
        style.container,
        'd-flex flex-column justify-content-center justify-content-md-start align-items-center'
      )}
    >
      <Address />
      <AssetsDetails totalSales={0} sales={0} />
      <ComputeHistory />
    </div>
  );
};

export default Profile;
