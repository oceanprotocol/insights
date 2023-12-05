// import { Button } from '@chakra-ui/react';
import cs from 'classnames';

import styles from './style.module.scss';

import Button from '../Button';
import { useWalletContext } from '../../../shared/@ocean/context/WalletContext';

const ConnectButton = () => {
  const { handleConnect, isWalletConnecting } = useWalletContext();

  return (
    <Button
      className={cs(
        styles.button,
        styles.initial,
        styles.connect,
        'me-md-3 h-100'
      )}
      onClick={() => handleConnect()}
    >
      {isWalletConnecting ? 'Loading...' : 'Connect'}
    </Button>
  );
};

export default ConnectButton;
