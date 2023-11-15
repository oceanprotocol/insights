import { useState, useEffect, useCallback } from 'react';
import { LoggerInstance } from '@oceanprotocol/lib';
import {
  useNetwork,
  useAccount,
  useBalance as useBalanceWagmi,
} from 'wagmi';
import { useMarketMetadata } from '../context/MarketMetadata';
import { getTokenBalance } from '../../utilities/wallet';
import { useEthersProvider } from '@/shared/utilities/wallet/ethersProvider';
import { useUser } from '../context/UserContext';
import config from '../../../../config';
import { magic } from '../../utilities/libs/magic';

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
  // const { address } = useAccount();
  const { user } = useUser();
  const { data: balanceNativeToken } = useBalanceWagmi({
    address: user as `0x${string}`,
    chainId: 11155111,
  });
  console.log(
    '🚀 ~ file: useBalance.tsx:30 ~ useBalance ~ balanceNativeToken:',
    balanceNativeToken
  );
  const web3provider = useEthersProvider();
  console.log(
    '🚀 ~ file: useBalance.tsx:37 ~ useBalance ~ web3provider:',
    web3provider
  );

  const { approvedBaseTokens } = useMarketMetadata();

  const [balance, setBalance] = useState<UserBalance>({
    eth: '0',
  });

  // -----------------------------------
  // Helper: Get user balance
  // -----------------------------------
  const getUserBalance = useCallback(async () => {
    if (!balanceNativeToken?.formatted || !user || !web3provider) return;

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
              web3provider
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
  }, [user, approvedBaseTokens, web3provider, balanceNativeToken]);

  useEffect(() => {
    getUserBalance();
  }, [getUserBalance]);

  return { balance };
}

export default useBalance;
