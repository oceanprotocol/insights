import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Web3 from 'web3';
import { magic } from '../../utilities/libs/magic';
import { WalletInfo } from 'magic-sdk';

// Define the structure of the Web3 context state
type Web3ContextType = {
  web3: Web3 | null;
  initializeWeb3: () => void;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleShowUI: () => Promise<void>;
  walletConnectionType: WalletInfo;
};

// Create the context with default values
const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Provider component to wrap around components that need access to the context
export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  // State variable to hold an instance of Web3
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [walletConnectionType, setWalletConnectionType] =
    useState<WalletInfo>(undefined);

  // Initialize Web3
  const initializeWeb3 = useCallback(async () => {
    // Get the provider from the Magic instance
    const provider = await magic.wallet.getProvider();
    // Create a new instance of Web3 with the provider
    const web3 = new Web3(provider);

    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      const walletInfo = await magic.wallet.getInfo();
      setWalletConnectionType(walletInfo);
    }
    // Save the instance to state
    setWeb3(web3);
  }, []);

  const handleConnect = async () => {
    try {
      await magic?.wallet.connectWithUI();
      initializeWeb3();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await magic?.wallet.disconnect();
      initializeWeb3();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowUI = async () => {
    try {
      await magic?.wallet.showUI();
    } catch (error) {
      console.error(error);
    }
  };

  // Effect to initialize Web3 when the component mounts
  useEffect(() => {
    initializeWeb3();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        initializeWeb3,
        handleConnect,
        handleDisconnect,
        handleShowUI,
        walletConnectionType,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
