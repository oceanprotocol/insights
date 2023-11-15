// import { Button } from '@chakra-ui/react';
import { magic } from '../../shared/utilities/libs/magic';
import { useConnect } from "wagmi";

import Button from './Button';

import styles from './Wallet/Account.module.scss';
import { useWeb3 } from '../../shared/@ocean/context/WalletContext';

const ConnectButton = () => {
  const { connect, connectors, isLoading, isIdle } = useConnect();
  const { handleConnect } = useWeb3();

  return (
    <Button
      className={`${styles.button} ${styles.initial} ${styles.connect} h-100`}
      // onClick={() => connect({ connector: connectors[1] })}
      onClick={() => handleConnect()}
    >
      {isLoading ? 'Loading...' : isIdle ? 'Connect' : 'Connecting...'}
    </Button>
  );
};

export default ConnectButton;
