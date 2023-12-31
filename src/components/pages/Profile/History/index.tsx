import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Tabs from '../../../custom/Tabs';
import PublishedList from './PublishedList';
import Downloads from './Downloads';
import ComputeJobs from './ComputeJobs';
import styles from './index.module.css';
import { getComputeJobs } from '../../../../shared/@ocean/utils/compute';
import { useCancelToken } from '../../../../shared/@ocean/hooks/useCancelToken';
import { LoggerInstance } from '@oceanprotocol/lib';
import { useWalletContext } from '../../../../shared/@ocean/context/WalletContext';
import config from '../../../../../config';

interface HistoryTab {
  title: string;
  content: JSX.Element;
}

const refreshInterval = 10000; // 10 sec.

const chainIds = config.oceanApp.chainIds;

function getTabs(
  accountId: string,
  userAccountId: string,
  jobs: ComputeJobMetaData[],
  isLoadingJobs: boolean,
  refetchJobs: boolean,
  setRefetchJobs: any
): HistoryTab[] {
  const defaultTabs: HistoryTab[] = [
    {
      title: 'Published',
      content: <PublishedList accountId={accountId} />,
    },
    {
      title: 'Downloads',
      content: <Downloads accountId={accountId} />,
    },
  ];
  const computeTab: HistoryTab = {
    title: 'Compute Jobs',
    content: (
      <ComputeJobs
        accountId={accountId}
        jobs={jobs}
        isLoading={isLoadingJobs}
        refetchJobs={() => setRefetchJobs(!refetchJobs)}
      />
    ),
  };
  if (accountId === userAccountId) {
    defaultTabs.push(computeTab);
  }
  return defaultTabs;
}

export default function HistoryPage({
  accountIdentifier,
}: {
  accountIdentifier: string;
}): ReactElement {
  const { user: accountId } = useWalletContext();
  const newCancelToken = useCancelToken();

  const url = new URL(location.href);
  const defaultTab = url.searchParams.get('defaultTab');

  const [refetchJobs, setRefetchJobs] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobs, setJobs] = useState<ComputeJobMetaData[]>([]);

  const fetchJobs = useCallback(
    async (type: string) => {
      if (!chainIds || chainIds.length === 0 || !accountId) {
        return;
      }

      try {
        type === 'init' && setIsLoadingJobs(true);
        const computeJobs = await getComputeJobs(
          chainIds,
          accountId,
          null,
          newCancelToken()
        );
        setJobs(computeJobs.computeJobs);
        setIsLoadingJobs(!computeJobs.isLoaded);
      } catch (error) {
        LoggerInstance.error(error.message);
        setIsLoadingJobs(false);
      }
    },
    [accountId, chainIds, isLoadingJobs, newCancelToken]
  );

  useEffect(() => {
    fetchJobs('init');

    // init periodic refresh for jobs
    const balanceInterval = setInterval(
      () => fetchJobs('repeat'),
      refreshInterval
    );

    return () => {
      clearInterval(balanceInterval);
    };
  }, [refetchJobs]);

  const tabs = getTabs(
    accountIdentifier,
    accountId,
    jobs,
    isLoadingJobs,
    refetchJobs,
    setRefetchJobs
  );

  let defaultTabIndex = 0;
  defaultTab === 'ComputeJobs' ? (defaultTabIndex = 4) : (defaultTabIndex = 0);

  return (
    <Tabs items={tabs} className={styles.tabs} defaultIndex={defaultTabIndex} />
  );
}
