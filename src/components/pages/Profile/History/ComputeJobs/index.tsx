import React, { ReactElement, useState } from 'react';
import Table, { TableOceanColumn } from '../../../../custom/Table';
import Button from '../../../../custom/Button2';
import Details from './Details';
import Refresh from '../../../../../assets/refresh.svg';
import NetworkName from '../../../../custom/NetworkName';
import styles from './index.module.css';
import AssetListTitle from '../../../../custom/AssetListTitle';
import { useAccount } from 'wagmi';
import Time from '../../../../custom/Time';
import config from '../../../../../../config';

export function Status({ children }: { children: string }): ReactElement {
  return <div className={styles.status}>{children}</div>;
}

const columns: TableOceanColumn<ComputeJobMetaData>[] = [
  {
    name: 'Dataset',
    selector: (row) => (
      <AssetListTitle did={row.inputDID[0]} title={row.assetName} />
    ),
  },
  {
    name: 'Network',
    selector: (row) => <NetworkName networkId={row.networkId} />,
  },
  {
    name: 'Created',
    selector: (row) => <Time date={row.dateCreated} isUnix relative />,
  },
  {
    name: 'Finished',
    selector: (row) =>
      row.dateFinished ? <Time date={row.dateFinished} isUnix relative /> : '',
  },
  {
    name: 'Status',
    selector: (row) => <Status>{row.statusText}</Status>,
  },
  {
    name: 'Actions',
    selector: (row) => <Details job={row} />,
  },
];

export default function ComputeJobs({
  minimal,
  jobs,
  isLoading,
  refetchJobs,
  accountId,
}: {
  minimal?: boolean;
  jobs?: ComputeJobMetaData[];
  isLoading?: boolean;
  accountId: string;
  refetchJobs?: any;
}): ReactElement {
  const chainIds = config.oceanApp.chainIds;
  const [columnsMinimal] = useState([columns[4], columns[5], columns[3]]);

  return accountId ? (
    <>
      {jobs?.length >= 0 && !minimal && (
        <Button
          style="text"
          size="small"
          title="Refresh compute jobs"
          onClick={async () => await refetchJobs(true)}
          disabled={isLoading}
          className={styles.refresh}
        >
          {/* <Refresh /> */}
          Refresh
        </Button>
      )}
      <Table
        columns={minimal ? columnsMinimal : columns}
        data={jobs}
        isLoading={isLoading}
        defaultSortFieldId="row.dateCreated"
        defaultSortAsc={false}
        emptyMessage={chainIds.length === 0 ? 'No network selected' : null}
      />
    </>
  ) : (
    <div className="no-wallet">Please connect your wallet.</div>
  );
}
