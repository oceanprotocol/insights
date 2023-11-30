// import { Button } from '@chakra-ui/react';
import Button from './Button';

import styles from './Wallet/Account.module.scss';
import { useWalletContext } from '../../shared/@ocean/context/WalletContext';

const ConnectButton = () => {
  const { handleConnect, isWalletConnecting } = useWalletContext();

  return (
    <Button
      className={`${styles.button} ${styles.initial} ${styles.connect} me-md-3 h-100`}
      onClick={() => handleConnect()}
    >
      {isWalletConnecting ? 'Loading...' : 'Connect'}
    </Button>
  );
};

export default ConnectButton;
