// import { Button } from '@chakra-ui/react';
import Button from './Button';

import styles from './Wallet/Account.module.scss';
import { useWeb3 } from '../../shared/@ocean/context/WalletContext';

const ConnectButton = () => {
  const { handleConnect, isWalletConnecting } = useWeb3();

  return (
    <Button
      className={`${styles.button} ${styles.initial} ${styles.connect} h-100`}
      onClick={() => handleConnect()}
    >
      {isWalletConnecting ? 'Loading...' : 'Connect'}
    </Button>
  );
};

export default ConnectButton;
