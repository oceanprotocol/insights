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
import { Signer, ethers } from 'ethers';

// Define the structure of the Web3 context state
type Web3ContextType = {
  web3: Web3 | null;
  initializeWeb3: () => void;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleShowUI: () => Promise<void>;
  walletConnectionType: WalletInfo;
  chainId: number;
  web3Signer: Signer;
  isWalletConnecting: boolean;
};

// Create the context with default values
const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Provider component to wrap around components that need access to the context
export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  // State variable to hold an instance of Web3
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [chainId, setChainId] = useState<number>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [web3Signer, setWeb3Signer] = useState<Signer>();
  const [walletConnectionType, setWalletConnectionType] =
    useState<WalletInfo>(undefined);

  // Initialize Web3
  const initializeWeb3 = useCallback(async () => {
    // Get the provider from the Magic instance
    const provider = await magic.wallet.getProvider();
    const ethersMagicProvider = new ethers.providers.Web3Provider(provider);
    const magicEthersSigner = ethersMagicProvider.getSigner();
    // Create a new instance of Web3 with the provider
    const web3 = new Web3(provider);

    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      const activeChainId = await web3.eth.getChainId();
      setChainId(activeChainId);
      const walletInfo = await magic.wallet.getInfo();
      setWalletConnectionType(walletInfo);
      setWeb3Signer(magicEthersSigner);
    }
    // Save the instance to state
    setWeb3(web3);
  }, []);

  const handleConnect = async () => {
    try {
      setIsWalletConnecting(true);
      await magic?.wallet.connectWithUI();
      initializeWeb3();
      await magic?.user?.isLoggedIn();
      setIsWalletConnecting(false);
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
        chainId,
        web3Signer,
        isWalletConnecting,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
