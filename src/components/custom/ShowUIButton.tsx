import { useEffect, useState } from 'react';
// import { Button } from '@chakra-ui/react';
import { magic } from '../../shared/utilities/libs/magic';
import Button from './Button';
import styles from './Wallet/Account.module.scss';

const ShowUIButton = () => {
  // Initialize state variable to decide whether to show button or not
  const [showButton, setShowButton] = useState(false);

  // Define a function to check the type of the wallet
  const checkWalletType = async () => {
    try {
      // Fetch the wallet's information using Magic's user.getInfo method
      // @ts-ignore
      const walletInfo = await magic.user.getInfo();
      console.log(walletInfo);

      ///@ts-ignore
      // Determine if the wallet type is "magic"
      const isMagicWallet = walletInfo.walletType === 'magic';

      // Set 'showButton' state based on the result of the check
      setShowButton(isMagicWallet);
    } catch (error) {
      // Log any errors that occur during the wallet type check process
      console.error('checkWalletType:', error);
    }
  };

  useEffect(() => {
    // Call the checkWalletType function
    checkWalletType();
  }, [magic]);

  // Define the event handler for the button click
  const handleShowUI = async () => {
    try {
      // Try to show the magic wallet user interface
      // @ts-ignore
      await magic?.wallet.showUI();
    } catch (error) {
      // Log any errors that occur during the process
      console.error('handleShowUI:', error);
    }
  };

  // Render the button component if showButton is true, otherwise render nothing
  return showButton ? (
    <Button
      className={`${styles.button} ${styles.initial} ${styles.connect} me-2 h-100`}
      onClick={handleShowUI}
    >
      Show UI
    </Button>
  ) : null;
};

export default ShowUIButton;
