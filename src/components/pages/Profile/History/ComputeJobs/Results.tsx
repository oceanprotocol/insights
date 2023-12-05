import {
  ComputeResultType,
  downloadFileBrowser,
  getErrorMessage,
  LoggerInstance,
  Provider,
} from '@oceanprotocol/lib';
import React, { ReactElement, useEffect, useState } from 'react';
import { ListItem } from '../../../../custom/Lists';
import Button from '../../../../custom/Button';
import styles from './Results.module.css';
import FormHelp from '../../../../custom/Help';
import { getAsset } from '../../../../../shared/@ocean/utils/aquarius';
import { toast } from 'react-toastify';
import { useCancelToken } from '../../../../../shared/@ocean/hooks/useCancelToken';
import { useWalletContext } from '../../../../../shared/@ocean/context/WalletContext';

export default function Results({
  job,
}: {
  job: ComputeJobMetaData;
}): ReactElement {
  const providerInstance = new Provider();
  const { user: accountId, web3Signer: signer } = useWalletContext();

  const [datasetProvider, setDatasetProvider] = useState<string>();
  const newCancelToken = useCancelToken();

  const isFinished = job.dateFinished !== null;

  useEffect(() => {
    async function getAssetMetadata() {
      const ddo = await getAsset(job.inputDID[0], newCancelToken());
      setDatasetProvider(ddo?.services[0]?.serviceEndpoint);
    }
    getAssetMetadata();
  }, [job.inputDID, newCancelToken]);

  function getDownloadButtonValue(type: ComputeResultType): string {
    let buttonName;
    switch (type) {
      case 'output':
        buttonName = 'results';
        break;
      case 'algorithmLog':
        buttonName = 'algorithm logs';
        break;
      case 'configrationLog':
        buttonName = 'configuration logs';
        break;
      case 'publishLog':
        buttonName = 'publish logs';
        break;
      default:
        buttonName = 'results';
        break;
    }
    return buttonName;
  }

  async function downloadResults(resultIndex: number) {
    if (!accountId || !job) return;

    try {
      const jobResult = await providerInstance.getComputeResultUrl(
        datasetProvider,
        signer,
        job.jobId,
        resultIndex
      );
      await downloadFileBrowser(jobResult);
    } catch (error) {
      const message = getErrorMessage(error.message);
      LoggerInstance.error('[Provider Get c2d results url] Error:', message);
      toast.error(message);
    }
  }

  return (
    <div className={styles.results}>
      <h4 className={styles.title}>Results</h4>
      {isFinished ? (
        <ul>
          {job.results &&
            Array.isArray(job.results) &&
            job.results.map((jobResult, i) =>
              jobResult.filename ? (
                <ListItem key={i}>
                  <Button
                    style="text"
                    size="small"
                    onClick={() => downloadResults(i)}
                    download
                  >
                    {getDownloadButtonValue(jobResult.type)}
                  </Button>
                </ListItem>
              ) : (
                <ListItem key={i}>No results found.</ListItem>
              )
            )}
        </ul>
      ) : (
        <p> Waiting for results...</p>
      )}
      <FormHelp className={styles.help}>
        Results are stored for 30 days.
      </FormHelp>
    </div>
  );
}
