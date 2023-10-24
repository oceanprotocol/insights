
import { magic } from '@/shared/utilities/libs/magic';
import { useState, useEffect } from 'react';

export const useIsMagicWalletConnected = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    const checkIfWalletIsConnected = async () => {
      const {walletType} = await magic.wallet.getInfo();
      console.log('walletType', walletType)
      if (walletType) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
      
    };

    checkIfWalletIsConnected();

  }, []);

  return isConnected;
};