import { useState, useEffect, useCallback } from 'react';
import { LoggerInstance } from '@oceanprotocol/lib';
import { useBalance as useBalanceWagmi } from 'wagmi';
import { useMarketMetadata } from '../context/MarketMetadata';
import { getTokenBalance } from '../../utilities/wallet';
import { useEthersProvider } from '@/shared/utilities/wallet/ethersProvider';
import { useUser } from '../context/UserContext';
import config from '../../../../config';
import { magic } from '../../utilities/libs/magic';
import { useWeb3 } from '../context/WalletContext';

interface BalanceProviderValue {
  balance: UserBalance;
}

type ApprovedBaseTokensType = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
};

function useBalance(): BalanceProviderValue {
  const { user } = useUser();
  const { web3 } = useWeb3();
  const { data: balanceNativeToken } = useBalanceWagmi({
    address: user as `0x${string}`,
    chainId: config.network.acceptedChainId,
  });

  const { approvedBaseTokens } = useMarketMetadata();

  const [balance, setBalance] = useState<UserBalance>({
    eth: '0',
  });

  // -----------------------------------
  // Helper: Get user balance
  // -----------------------------------
  const getUserBalance = useCallback(async () => {
    if (!balanceNativeToken?.formatted || !user || !web3) return;

    try {
      const userBalance = balanceNativeToken?.formatted;
      const key = balanceNativeToken?.symbol.toLowerCase();
      const newBalance: UserBalance = { [key]: userBalance };

      if (approvedBaseTokens?.length > 0) {
        await Promise.all(
          approvedBaseTokens.map(async (token) => {
            const { address: tokenAddress, decimals, symbol } = token;
            if (!decimals) {
              return;
            }
            const tokenBalance = await getTokenBalance(
              user,
              decimals,
              tokenAddress,
              web3
            );
            if (!tokenBalance) {
              return;
            }
            newBalance[symbol.toLocaleLowerCase()] = tokenBalance;
          })
        );
      }

      setBalance(newBalance);
      LoggerInstance.log('[useBalance] Balance: ', newBalance);
    } catch (error: any) {
      LoggerInstance.error('[useBalance] Error: ', error.message);
    }
  }, [user, approvedBaseTokens, web3, balanceNativeToken]);

  useEffect(() => {
    getUserBalance();
  }, [getUserBalance]);

  return { balance };
}

export default useBalance;
