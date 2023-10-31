// import { Button } from '@chakra-ui/react';
import { magic } from '../../shared/utilities/libs/magic';
import { useConnect } from "wagmi";

import Button from './Button';

import styles from './Wallet/Account.module.scss';

const ConnectButton = () => {
  const { connect, connectors, isLoading, isIdle } = useConnect();

  // Render the button component with the click event handler
  return (
    <Button
      className={`${styles.button} ${styles.initial} ${styles.connect} h-100`}
      onClick={() => connect({ connector: connectors[0] })}
    >
      {isLoading ? "Loading..." : isIdle ? "Connect" : "Connecting..."}
    </Button>
  );
};

export default ConnectButton;
