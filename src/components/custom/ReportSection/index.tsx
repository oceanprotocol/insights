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
  const { DubaiCardData, AlgoProcessingCardData } = useData();
  const {chain} = useNetwork()
  const { data: signer } = useSigner()
  const { DropdownData } = useOptionsDropdown();
  const { t } = useTranslation(['common']);
  const initialStatesLoading = {};
  const initialStatesMessages = {};
  DubaiCardData.forEach((dataItem) => {
    initialStatesLoading['dubaiLoading'+dataItem.id] = false;
    initialStatesMessages['dubaiMessage'+dataItem.id] = '';

  });
  const [loadingStates, setLoadingStates] = useState(initialStatesLoading);
  const [messagesStates, setMessagesStates] = useState(initialStatesMessages);

  const toggleCardState = (id:number) => {
    setLoadingStates((prevState) => ({
      ...prevState,
      ['dubaiLoading'+id]: !prevState['dubaiLoading'+id],
    }));
  };

  const updateCardMessage = (id:number, message:string) => {
    setMessagesStates((prevState) => ({
      ...prevState,
      ['dubaiMessage'+id]: message,
    }));
  };

  async function downloadReport(datasetDid: string, algoDid: string, cardId: number) {
    toggleCardState(cardId)
    try{
      updateCardMessage(cardId, 'Ordering dataset & algorithm and starting compute job!')
      const jobId = await startComputeJob(datasetDid, algoDid, chain?.id, signer)
      console.log('Compute job started: ',jobId)
      updateCardMessage(cardId, `Compute job started: ${jobId} , Running algorithm ...`)
      const jobFinished = await waitForJobToFinish(datasetDid, jobId, chain?.id, signer)
      console.log('Job finished: ',jobFinished)
      updateCardMessage(cardId, `Compute job finished!`)
      for (let index = 0; index < jobFinished.results.length; index++) {
        const file = jobFinished.results[index];
        if(file.type === 'output'){
          updateCardMessage(cardId, ` Downloading results ...`)
          await downloadJobResults(jobId, index, chain?.id, signer)
          toggleCardState(cardId)
        }
      }
    }catch(error){
      LoggerInstance.error('[start compute job] ',error.message)
      toast.error(`Download report error]: ${error.message}`)
      toggleCardState(cardId)
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
            loading={loadingStates['dubaiLoading'+card.id]}
            optionsDropdownLeft={null}
            optionsDropdownRight={null}
            computeReportResults={downloadReport}
            datasetDid={card.datasetDid}
            algorithmDid={card.algoDid}
            outputMessage={messagesStates['dubaiMessage'+card.id]}
          />
        ))}
      </div>
      <div>
        <div className={cx(styles.margin, 'play40 text-white text-center')}>
          {t('titleProcessingAlgos')}
        </div>
        <div
          className={cx(styles.marginSubtitle, 'play20 text-white text-center')}
        >
          {t('titleUpdate')}
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
        {AlgoProcessingCardData.map((card: CardPropType) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            imageSrc={card.image}
            text={card.text}
            price={card.price}
            totalDownloads={card.downloads}
            loading={false}
            optionsDropdownLeft={DropdownData}
            optionsDropdownRight={DropdownData}
            outputMessage={'Preparing stuff'}
          />
        ))}
      </div>
    </div>
  );
}
