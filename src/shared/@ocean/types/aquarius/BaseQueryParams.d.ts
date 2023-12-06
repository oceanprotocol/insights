interface EsPaginationOptions {
  from?: number
  size?: number
}

interface BaseQueryParams {
  chainIds: number[];
  nestedQuery?: any;
  esPaginationOptions?: EsPaginationOptions;
  sortOptions?: SortOptions;
  aggs?: any;
  filters?: FilterTerm[];
  ignorePurgatory?: boolean;
  ignoreState?: boolean;
}
