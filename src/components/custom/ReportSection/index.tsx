import react, { ReactNode, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';
import styles from './styles.module.scss';
import Card from './Card/index';
import useData, { CardPropType } from './Card/useData';
import useOptionsDropdown from './Dropdown/DropdownData';
import { downloadJobResults,  startComputeJob, waitForJobToFinish } from '@/shared/@ocean/utils/computeToData';
import { useNetwork, useSigner } from 'wagmi';
import { LoggerInstance } from '@oceanprotocol/lib';
import { toast } from 'react-toastify'

export default function Report() {
  const { DubaiCardData, TwitterCardData } = useData();
  const {chain} = useNetwork()
  const { data: signer } = useSigner()
  const [dubaiLoading, setDubaiLoading] = useState(false)
  const [twitterLoading, setTwitterLoading] = useState(false)
  const { DropdownData } = useOptionsDropdown();
  const { t } = useTranslation(['common']);

  async function downloadReport(datasetDid: string, algoDid: string) {
    setDubaiLoading(true)
    try{
      const jobId = await startComputeJob(datasetDid, algoDid, chain?.id, signer)
      console.log('Compute job started: ',jobId)
      const jobFinished = await waitForJobToFinish(datasetDid, jobId, chain?.id, signer)
      console.log('Job finished: ',jobFinished)
      for (let index = 0; index < jobFinished.results.length; index++) {
        const file = jobFinished.results[index];
        if(file.type === 'output'){
          await downloadJobResults(jobId, index, chain?.id, signer)
          setDubaiLoading(false)
        }
      }
    }catch(error){
      LoggerInstance.error('[start compute job] ',error.message)
      toast.error(`Download report error]: ${error.message}`)
      setDubaiLoading(false)
    }

  }

  return (
    <div className={cx(styles.background)}>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
        {DubaiCardData.map((card: CardPropType) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            imageSrc={card.image}
            text={card.text}
            price={card.price}
            totalDownloads={card.downloads}
            loading={dubaiLoading}
            optionsDropdownLeft={DropdownData}
            optionsDropdownRight={DropdownData}
            computeReportResults={downloadReport}
            datasetDid={card.datasetDid}
            algorithmDid={card.algoDid}
          />
        ))}
      </div>
      <div>
        <div className={cx(styles.margin, 'play40 text-white text-center')}>
          {t('titleTwitter')}
        </div>
        <div
          className={cx(styles.marginSubtitle, 'play20 text-white text-center')}
        >
          {t('titleUpdate')}
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
        {TwitterCardData.map((card: CardPropType) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            imageSrc={card.image}
            text={card.text}
            price={card.price}
            totalDownloads={card.downloads}
            loading={twitterLoading}
            optionsDropdownLeft={DropdownData}
            optionsDropdownRight={DropdownData}
          />
        ))}
      </div>
    </div>
  );
}
