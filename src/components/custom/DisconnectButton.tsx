// import { Button } from '@chakra-ui/react';
import { useWeb3 } from '../../shared/@ocean/context/Web3Context';
import { magic } from '../../shared/utilities/libs/magic';
import Button from './Button';
import styles from './Wallet/Account.module.scss';

const DisconnectButton = () => {
  // Get the initializeWeb3 function from the Web3 context
  const { initializeWeb3 } = useWeb3();

  // Define the event handler for the button click
  const handleDisconnect = async () => {
    try {
      // Try to disconnect the user's wallet using Magic's logout method
      // @ts-ignore
      await magic.user.logout();

      // After successful disconnection, re-initialize the Web3 instance
      initializeWeb3();
    } catch (error) {
      // Log any errors that occur during the disconnection process
      console.log('handleDisconnect:', error);
    }
  };

  // Render the button component with the click event handler
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
