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
  user: string;
};

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType);

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [chainId, setChainId] = useState<number>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [web3Signer, setWeb3Signer] = useState<Signer>();
  const [walletConnectionType, setWalletConnectionType] =
    useState<WalletInfo>(undefined);

  const initializeWeb3 = useCallback(async () => {
    const provider = await magic.wallet.getProvider();
    const ethersMagicProvider = new ethers.providers.Web3Provider(provider);
    const magicEthersSigner = ethersMagicProvider.getSigner();

    const web3 = new Web3(provider);

    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      const activeChainId = await web3.eth.getChainId();
      setChainId(activeChainId);
      const walletInfo = await magic.wallet.getInfo();
      setWalletConnectionType(walletInfo);
      setWeb3Signer(magicEthersSigner);
    }
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

  const fetchUserAccount = async () => {
    const accounts = await web3?.eth.getAccounts();

    setUser(accounts ? accounts[0] : null);
  };

  useEffect(() => {
    initializeWeb3();
  }, []);

  useEffect(() => {
    fetchUserAccount();
  }, [web3]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        user,
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
