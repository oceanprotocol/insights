import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { magic } from '../../utilities/libs/magic';
import { WalletInfo } from 'magic-sdk';
import { Signer, ethers } from 'ethers';

type EthersContextType = {
  ethersProvider: ethers.providers.Web3Provider | null;
  initializeEthers: () => void;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleShowUI: () => Promise<void>;
  walletConnectionType: WalletInfo;
  chainId: number;
  web3Signer: Signer;
  isWalletConnecting: boolean;
  user: string;
};

const EthersContext = createContext<EthersContextType>({} as EthersContextType);

export const useEthers = () => useContext(EthersContext);

export const EthersProvider = ({ children }: { children: React.ReactNode }) => {
  const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [chainId, setChainId] = useState<number>(null);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [web3Signer, setWeb3Signer] = useState<Signer>();
  const [walletConnectionType, setWalletConnectionType] =
    useState<WalletInfo>(undefined);

  const initializeEthers = useCallback(async () => {
    const provider = await magic.wallet.getProvider();
    const ethersMagicProvider = new ethers.providers.Web3Provider(provider);
    const magicEthersSigner = ethersMagicProvider.getSigner();

    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      const { chainId } = await ethersMagicProvider.getNetwork()
      setChainId(chainId);
      const walletInfo = await magic.wallet.getInfo();
      setWalletConnectionType(walletInfo);
      setWeb3Signer(magicEthersSigner);
    }
    setEthersProvider(ethersMagicProvider);
  }, []);

  const handleConnect = async () => {
    try {
      setIsWalletConnecting(true);
      await magic?.wallet.connectWithUI();
      initializeEthers();
      await magic?.user?.isLoggedIn();
      setIsWalletConnecting(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await magic?.wallet.disconnect();
      initializeEthers();
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
    const accounts = await ethersProvider?.listAccounts();
    setUser(accounts ? accounts[0] : null);
  };

  useEffect(() => {
    initializeEthers();
  }, []);

  useEffect(() => {
    fetchUserAccount();
  }, [ethersProvider]);

  return (
    <EthersContext.Provider
      value={{
        ethersProvider,
        user,
        initializeEthers,
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
    </EthersContext.Provider>
  );
};
