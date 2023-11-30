import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import config from '../../config';
import Profile from '../components/pages/Profile';
import ProfileProvider from '../shared/@ocean/context/Profile';
import { useWalletContext } from '../shared/@ocean/context/WalletContext';

export default function Home() {
  const { user } = useWalletContext();
  return (
    <ProfileProvider accountId={user} ownAccount={true}>
      <Profile />
    </ProfileProvider>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      ...(await serverSideTranslations(config.language, config.translateLists)),
    },
  };
}
