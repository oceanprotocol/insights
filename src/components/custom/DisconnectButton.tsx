// import { Button } from '@chakra-ui/react';
import { magic } from '../../shared/utilities/libs/magic';
import Button from './Button';
import styles from './Wallet/Account.module.scss';

const DisconnectButton = () => {


  // Define the event handler for the button click
  const handleDisconnect = async () => {
    try {
      // Try to disconnect the user's wallet using Magic's logout method
      // @ts-ignore
      await magic.user.logout();

    } catch (error) {
      // Log any errors that occur during the disconnection process
      console.log('handleDisconnect:', error);
    }
  };

  return (
    <Button
      className={`${styles.button} ${styles.initial} ${styles.connect} me-2 h-100`}
      onClick={handleDisconnect}
    >
      Disconnect
    </Button>
  );
};

export default DisconnectButton;
