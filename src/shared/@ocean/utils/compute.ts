import {
  Asset,
  ServiceComputeOptions,
  PublisherTrustedAlgorithm,
  getHash,
  LoggerInstance,
  ComputeAlgorithm,
  DDO,
  Service,
  ProviderInstance,
  ComputeEnvironment,
  ComputeJob,
  getErrorMessage,
} from '@oceanprotocol/lib';
import { CancelToken } from 'axios';
import { gql } from 'urql';
import {
  queryMetadata,
  getFilterTerm,
  generateBaseQuery,
  getAssetsFromDids,
} from './aquarius';
import { fetchDataForMultipleChains } from './subgraph';
import { toast } from 'react-toastify';

const getComputeOrders = gql`
  query ComputeOrders($user: String!) {
    orders(
      orderBy: createdTimestamp
      orderDirection: desc
      where: { payer: $user }
    ) {
      id
      serviceIndex
      datatoken {
        address
      }
      tx
      createdTimestamp
    }
  }
`;

const getComputeOrdersByDatatokenAddress = gql`
  query ComputeOrdersByDatatokenAddress(
    $user: String!
    $datatokenAddress: String!
  ) {
    orders(
      orderBy: createdTimestamp
      orderDirection: desc
      where: { payer: $user, datatoken: $datatokenAddress }
    ) {
      id
      serviceIndex
      datatoken {
        address
      }
      tx
      createdTimestamp
    }
  }
`;

async function getAssetMetadata(
  queryDtList: string[],
  cancelToken: CancelToken,
  chainIds: number[]
): Promise<Asset[]> {
  const baseQueryparams = {
    chainIds,
    filters: [
      getFilterTerm('services.datatokenAddress', queryDtList),
      getFilterTerm('services.type', 'compute'),
      getFilterTerm('metadata.type', 'dataset'),
    ],
    ignorePurgatory: true,
  } as BaseQueryParams;
  const query = generateBaseQuery(baseQueryparams);
  const result = await queryMetadata(query, cancelToken);
  return result?.results;
}

async function getJobs(
  providerUrls: string[],
  accountId: string,
  assets: Asset[]
): Promise<ComputeJobMetaData[]> {
  const computeJobs: ComputeJobMetaData[] = [];
  try {
    const providerComputeJobs = (await ProviderInstance.computeStatus(
      providerUrls[0],
      accountId
    )) as ComputeJob[];

    if (providerComputeJobs) {
      providerComputeJobs.sort((a, b) => {
        if (a.dateCreated > b.dateCreated) {
          return -1;
        }
        if (a.dateCreated < b.dateCreated) {
          return 1;
        }
        return 0;
      });

      providerComputeJobs.forEach((job) => {
        const did = job.inputDID[0];
        const asset = assets.filter((x) => x.id === did)[0];
        if (asset) {
          const compJob: ComputeJobMetaData = {
            ...job,
            assetName: asset.metadata.name,
            assetDtSymbol: asset.datatokens[0].symbol,
            networkId: asset.chainId,
          };
          computeJobs.push(compJob);
        }
      });
    }
  } catch (err) {
    const message = getErrorMessage(err.message);
    LoggerInstance.error('[Compute to Data] Error:', message);
    toast.error(message);
  }
  return computeJobs;
}

export async function getComputeJobs(
  chainIds: number[],
  accountId: string,
  asset?: AssetExtended,
  cancelToken?: CancelToken
): Promise<ComputeResults> {
  if (!accountId) return;
  const assetDTAddress = asset?.datatokens[0]?.address;
  const computeResult: ComputeResults = {
    computeJobs: [],
    isLoaded: false,
  };
  const variables = assetDTAddress
    ? {
        user: accountId.toLowerCase(),
        datatokenAddress: assetDTAddress.toLowerCase(),
      }
    : {
        user: accountId.toLowerCase(),
      };

  const results = await fetchDataForMultipleChains(
    assetDTAddress ? getComputeOrdersByDatatokenAddress : getComputeOrders,
    variables,
    assetDTAddress ? [asset?.chainId] : chainIds
  );

  let tokenOrders: TokenOrder[] = [];
  results.map((result) =>
    result.orders.forEach((tokenOrder: TokenOrder) =>
      tokenOrders.push(tokenOrder)
    )
  );
  if (tokenOrders.length === 0) {
    computeResult.isLoaded = true;
    return computeResult;
  }

  tokenOrders = tokenOrders.sort(
    (a, b) => b.createdTimestamp - a.createdTimestamp
  );

  const datatokenAddressList = tokenOrders.map(
    (tokenOrder: TokenOrder) => tokenOrder.datatoken.address
  );
  if (!datatokenAddressList) return;

  const assets = await getAssetMetadata(
    datatokenAddressList,
    cancelToken,
    chainIds
  );

  const providerUrls: string[] = [];
  assets.forEach((asset: Asset) =>
    providerUrls.push(asset.services[0].serviceEndpoint)
  );

  computeResult.computeJobs = await getJobs(providerUrls, accountId, assets);
  computeResult.isLoaded = true;

  return computeResult;
}
