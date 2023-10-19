// import { Button } from '@chakra-ui/react';
import { magic } from '../../shared/utilities/libs/magic';
import Button from './Button';

import styles from './Wallet/Account.module.scss';

const ConnectButton = () => {
  // Define the event handler for the button click
  const handleConnect = async () => {
    try {
      await magic.wallet.connectWithUI();

    } catch (error) {
      // Log any errors that occur during the connection process
      console.error('handleConnect:', error);
    }
  };

  // Render the button component with the click event handler
  return (
    <Button
      className={`${styles.button} ${styles.initial} ${styles.connect} h-100`}
      onClick={handleConnect}
    >
      Connect w/ magic-link
    </Button>
  );
};

export default ConnectButton;
