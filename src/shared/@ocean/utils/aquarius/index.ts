import axios, { AxiosResponse, CancelToken } from 'axios';
import config from '../../../../../config';
import { Asset, LoggerInstance } from '@oceanprotocol/lib';
import { SortDirectionOptions } from '../../types/aquarius/SearchQuery';
import { OrdersData_orders as OrdersData } from '../../@types/subgraph/OrdersData';

export enum SortTermOptions {
  Created = 'nft.created',
  Relevance = '_score',
  Orders = 'stats.orders',
  Allocated = 'stats.allocated',
  Price = 'stats.price.value',
}

export function transformQueryResult(
  queryResult: SearchResponse,
  from = 0,
  size = 21
): PagedAssets {
  const result: PagedAssets = {
    results: [],
    page: 0,
    totalPages: 0,
    totalResults: 0,
    aggregations: [],
  };

  result.results = (queryResult.hits.hits || []).map(
    (hit) => hit._source as Asset
  );

  result.aggregations = queryResult.aggregations;
  result.totalResults = queryResult.hits.total.value;
  result.totalPages =
    result.totalResults / size < 1
      ? Math.floor(result.totalResults / size)
      : Math.ceil(result.totalResults / size);
  result.page = from ? from / size + 1 : 1;

  return result;
}

export function getFilterTerm(
  filterField: string,
  value: string | number | boolean | number[] | string[]
): FilterTerm {
  const isArray = Array.isArray(value);
  return {
    [isArray ? 'terms' : 'term']: {
      [filterField]: value,
    },
  };
}

export async function getAssetsNames(
  didList: string[],
  cancelToken: CancelToken
): Promise<Record<string, string>> {
  try {
    const response: AxiosResponse<Record<string, string>> = await axios.post(
      `${config.oceanApp.metadataCacheUri}/api/aquarius/assets/names`,
      { didList },
      { cancelToken }
    );
    if (!response || response.status !== 200 || !response.data) return;
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message);
    } else {
      LoggerInstance.error(error.message);
    }
  }
}

export async function queryMetadata(
  query: SearchQuery,
  cancelToken: CancelToken
): Promise<PagedAssets> {
  try {
    const response: AxiosResponse<SearchResponse> = await axios.post(
      `${config.oceanApp.metadataCacheUri}/api/aquarius/assets/query`,
      { ...query },
      { cancelToken }
    );
    if (!response || response.status !== 200 || !response.data) return;
    return transformQueryResult(response.data, query.from, query.size);
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message);
    } else {
      LoggerInstance.error(error.message);
    }
  }
}

export function generateBaseQuery(
  baseQueryParams: BaseQueryParams
): SearchQuery {
  const filters: unknown[] = [getFilterTerm('_index', 'aquarius')];
  baseQueryParams.filters && filters.push(...baseQueryParams.filters);
  baseQueryParams.chainIds &&
    filters.push(getFilterTerm('chainId', baseQueryParams.chainIds));
  !baseQueryParams.ignorePurgatory &&
    filters.push(getFilterTerm('purgatory.state', false));
  !baseQueryParams.ignoreState &&
    filters.push({
      bool: {
        must_not: [
          {
            term: {
              'nft.state': 5,
            },
          },
        ],
      },
    });
  const generatedQuery = {
    from: baseQueryParams.esPaginationOptions?.from || 0,
    size:
      baseQueryParams.esPaginationOptions?.size >= 0
        ? baseQueryParams.esPaginationOptions?.size
        : 1000,
    query: {
      bool: {
        ...baseQueryParams.nestedQuery,
        filter: filters,
      },
    },
  } as SearchQuery;

  if (baseQueryParams.aggs !== undefined) {
    generatedQuery.aggs = baseQueryParams.aggs;
  }

  if (baseQueryParams.sortOptions !== undefined)
    generatedQuery.sort = {
      [baseQueryParams.sortOptions.sortBy]:
        baseQueryParams.sortOptions.sortDirection ||
        SortDirectionOptions.Descending,
    };
  return generatedQuery;
}

export async function getAssetsFromDids(
  didList: string[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<Asset[]> {
  if (didList?.length === 0 || chainIds?.length === 0) return [];

  try {
    const orderedDDOListByDIDList: Asset[] = [];
    const baseQueryparams = {
      chainIds,
      filters: [getFilterTerm('_id', didList)],
      ignorePurgatory: true,
    } as BaseQueryParams;
    const query = generateBaseQuery(baseQueryparams);
    const result = await queryMetadata(query, cancelToken);

    didList.forEach((did: string) => {
      const ddo = result.results.find((ddo: Asset) => ddo.id === did);
      if (ddo) orderedDDOListByDIDList.push(ddo);
    });
    return orderedDDOListByDIDList;
  } catch (error) {
    LoggerInstance.error(error.message);
  }
}

export async function getPublishedAssets(
  accountId: string,
  chainIds: number[],
  cancelToken: CancelToken,
  ignoreState = false,
  page?: number,
  type?: string,
  accesType?: string
): Promise<PagedAssets> {
  if (!accountId) return;

  const filters: FilterTerm[] = [];

  filters.push(getFilterTerm('nft.state', [0, 4, 5]));
  filters.push(getFilterTerm('nft.owner', accountId.toLowerCase()));
  accesType !== undefined &&
    filters.push(getFilterTerm('services.type', accesType));
  type !== undefined && filters.push(getFilterTerm('metadata.type', type));

  const baseQueryParams = {
    chainIds,
    filters,
    sortOptions: {
      sortBy: SortTermOptions.Created,
      sortDirection: SortDirectionOptions.Descending,
    },
    aggs: {
      totalOrders: {
        sum: {
          field: SortTermOptions.Orders,
        },
      },
    },
    ignorePurgatory: true,
    ignoreState,
    esPaginationOptions: {
      from: (Number(page) - 1 || 0) * 9,
      size: 9,
    },
  } as BaseQueryParams;

  const query = generateBaseQuery(baseQueryParams);

  try {
    const result = await queryMetadata(query, cancelToken);
    return result;
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message);
    } else {
      LoggerInstance.error(error.message);
    }
  }
}

export async function getDownloadAssets(
  dtList: string[],
  tokenOrders: OrdersData[],
  chainIds: number[],
  cancelToken: CancelToken,
  ignoreState = false
): Promise<DownloadedAsset[]> {
  const baseQueryparams = {
    chainIds,
    filters: [
      getFilterTerm('services.datatokenAddress', dtList),
      getFilterTerm('services.type', 'access'),
    ],
    ignorePurgatory: true,
    ignoreState,
  } as BaseQueryParams;
  const query = generateBaseQuery(baseQueryparams);
  try {
    const result = await queryMetadata(query, cancelToken);
    const downloadedAssets: DownloadedAsset[] = result.results
      .map((asset) => {
        const order = tokenOrders.find(
          ({ datatoken }) =>
            datatoken?.address.toLowerCase() ===
            asset.services[0].datatokenAddress.toLowerCase()
        );

        return {
          asset,
          networkId: asset.chainId,
          dtSymbol: order?.datatoken?.symbol,
          timestamp: order?.createdTimestamp,
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return downloadedAssets;
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message);
    } else {
      LoggerInstance.error(error.message);
    }
  }
}

export async function getUserSales(
  accountId: string,
  chainIds: number[]
): Promise<number> {
  try {
    const result = await getPublishedAssets(accountId, chainIds, null);
    const { totalOrders } = result.aggregations;
    return totalOrders.value;
  } catch (error) {
    LoggerInstance.error('Error getUserSales', error.message);
  }
}

export async function getAsset(
  did: string,
  cancelToken: CancelToken
): Promise<Asset> {
  try {
    const response: AxiosResponse<Asset> = await axios.get(
      `${config.oceanApp.metadataCacheUri}/api/aquarius/assets/ddo/${did}`,
      { cancelToken }
    );
    if (!response || response.status !== 200 || !response.data) return;

    const data = { ...response.data };
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message);
    } else {
      LoggerInstance.error(error.message);
    }
  }
}
