import React, { ReactElement } from 'react';
import Table, { TableOceanColumn } from '../../../custom/Table';
import Time from '../../../custom/Time';
import AssetTitle from '../../../custom/AssetListTitle';
// import NetworkName from '@shared/NetworkName';
import { useProfile } from '../../../../shared/@ocean/context/Profile';
import config from '../../../../../config';
import NetworkName from '../../../custom/NetworkName';

const columns: TableOceanColumn<DownloadedAsset>[] = [
  {
    name: 'Dataset',
    selector: (row) => <AssetTitle asset={row.asset} />,
  },
  {
    name: 'Network',
    selector: (row) => <NetworkName networkId={row.networkId} />,
  },
  {
    name: 'Datatoken',
    selector: (row) => row.dtSymbol,
  },
  {
    name: 'Time',
    selector: (row) => <Time date={row.timestamp.toString()} relative isUnix />,
  },
];

export default function ComputeDownloads({
  accountId,
}: {
  accountId: string;
}): ReactElement {
  const { downloads, isDownloadsLoading } = useProfile();
  const chainIds = config.oceanApp.chainIds;

  return accountId ? (
    <Table
      columns={columns}
      data={downloads}
      paginationPerPage={10}
      isLoading={isDownloadsLoading}
      emptyMessage={chainIds.length === 0 ? 'No network selected' : null}
    />
  ) : (
    <div className="no-wallet">Please connect your wallet.</div>
  );
}
