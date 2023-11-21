import React, {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MarketMetadataProviderValue, OpcFee } from './_types';
import config from '../../../../../config';
import { LoggerInstance } from '@oceanprotocol/lib';
import { OperationResult } from 'urql';
import { useNetwork, useConnect } from 'wagmi';
import {
  fetchData,
  getOpcsApprovedTokens,
  getQueryContext,
} from '../../utils/subgraph';
import { OpcQuery } from '../../@types/subgraph/OpcQuery';
import { opcQuery } from './_queries';

const MarketMetadataContext = createContext({} as MarketMetadataProviderValue);

function MarketMetadataProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const appConfig = config.oceanApp;
  const { isLoading } = useConnect();
  const { chain } = useNetwork();

  const [opcFees, setOpcFees] = useState<OpcFee[]>();
  const [approvedBaseTokens, setApprovedBaseTokens] = useState<TokenInfo[]>();

  useEffect(() => {
    async function getOpcData() {
      const opcData = [];
      for (let i = 0; i < appConfig.chainIdsSupported.length; i++) {
        let queryContext = getQueryContext(appConfig.chainIdsSupported[i]);
        if (!queryContext) {
          return;
        }
        const response: OperationResult<OpcQuery> = await fetchData(
          opcQuery,
          null,
          queryContext
        );

        if (!response?.data?.opc?.approvedTokens) {
          return;
        }

        opcData.push({
          chainId: appConfig.chainIdsSupported[i],
          approvedTokens: response?.data?.opc?.approvedTokens.map(
            (token) => token.address
          ),
          swapApprovedFee: response.data?.opc.swapOceanFee,
          swapNotApprovedFee: response.data?.opc.swapNonOceanFee,
        } as OpcFee);
      }
      LoggerInstance.log('[MarketMetadata] Got new data.', {
        opcFees: opcData,
        appConfig,
      });
      setOpcFees(opcData);
    }
    getOpcData();
  }, []);

  const getOpcFeeForToken = useCallback(
    (tokenAddress: string, chainId: number): string => {
      if (!opcFees) return '0';

      const opc = opcFees.filter((x) => x.chainId === chainId)[0];
      const isTokenApproved = opc.approvedTokens.includes(tokenAddress);
      return isTokenApproved ? opc.swapApprovedFee : opc.swapNotApprovedFee;
    },
    [opcFees]
  );

  // -----------------------------------
  // Get and set approved base tokens list
  // -----------------------------------
  const getApprovedBaseTokens = useCallback(async (chainId: number) => {
    try {
      const approvedTokensList = await getOpcsApprovedTokens(chainId);
      setApprovedBaseTokens(approvedTokensList);
      LoggerInstance.log(
        '[MarketMetadata] Approved baseTokens',
        approvedTokensList
      );
    } catch (error: any) {
      LoggerInstance.error('[MarketMetadata] Error: ', error.message);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    getApprovedBaseTokens(chain?.id || config.network.acceptedChainId);
  }, [chain?.id, getApprovedBaseTokens, isLoading]);

  return (
    <MarketMetadataContext.Provider
      value={
        {
          opcFees,
          appConfig,
          getOpcFeeForToken,
          approvedBaseTokens,
        } as MarketMetadataProviderValue
      }
    >
      {children}
    </MarketMetadataContext.Provider>
  );
}

// Helper hook to access the provider values
const useMarketMetadata = (): MarketMetadataProviderValue =>
  useContext(MarketMetadataContext);

export { MarketMetadataProvider, useMarketMetadata, MarketMetadataContext };
export default MarketMetadataProvider;
