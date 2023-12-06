import react, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';
import styles from './styles.module.scss';
import Card from './Card/index';
import useData, { CardPropType } from './Card/useData';
import {
  useOptionsDropdown,
  useImageProcessing,
} from './Dropdown/DropdownData';
import {
  downloadJobResults,
  startComputeJob,
  waitForJobToFinish,
} from '@/shared/@ocean/utils/computeToData';
import { LoggerInstance, UserCustomParameters } from '@oceanprotocol/lib';
import { toast } from 'react-toastify';
import config from '../../../../config';
import { useWalletContext } from '../../../shared/@ocean/context/WalletContext';

export default function Report() {
  const { web3Signer } = useWalletContext();
  const { DubaiCardData, AlgoProcessingCardData } = useData();
  const { DropdownData, NrOfRoomsDataDropdown } = useOptionsDropdown();
  const { ImageDataDropdown } = useImageProcessing();
  const { t } = useTranslation(['common']);
  const initialStatesLoading = {};
  const initialStatesMessages = {};
  const initialStatesDropdownRealEstate = {};
  const initialStatesImageProcessingDropdown = {};
  DubaiCardData.forEach((dataItem) => {
    initialStatesLoading['dubaiLoading' + dataItem.id] = false;
    initialStatesMessages['dubaiMessage' + dataItem.id] = '';
    initialStatesDropdownRealEstate['dropdown' + dataItem.id] = DropdownData;
  });
  AlgoProcessingCardData.forEach((dataItem) => {
    initialStatesLoading['algoProcessingLoading' + dataItem.id] = false;
    initialStatesMessages['algoProcessingMessage' + dataItem.id] = '';
    initialStatesImageProcessingDropdown['dropdown' + dataItem.id] =
      ImageDataDropdown;
  });
  initialStatesDropdownRealEstate['dropdown1'] = NrOfRoomsDataDropdown;
  initialStatesImageProcessingDropdown['dropdown1'] = ImageDataDropdown;
  const [loadingStates, setLoadingStates] = useState(initialStatesLoading);
  const [messagesStates, setMessagesStates] = useState(initialStatesMessages);

  const toggleCardState = (id: number) => {
    if (id < 4) {
      setLoadingStates((prevState) => ({
        ...prevState,
        ['dubaiLoading' + id]: !prevState['dubaiLoading' + id],
      }));
    } else {
      setLoadingStates((prevState) => ({
        ...prevState,
        ['algoProcessingLoading' + id]:
          !prevState['algoProcessingLoading' + id],
      }));
    }
  };

  const updateCardMessage = (id: number, message: string) => {
    if (id < 4) {
      setMessagesStates((prevState) => ({
        ...prevState,
        ['dubaiMessage' + id]: message,
      }));
    } else {
      setMessagesStates((prevState) => ({
        ...prevState,
        ['algoProcessingMessage' + id]: message,
      }));
    }
  };

  async function downloadReport(
    datasetDid: string,
    algoDid: string,
    cardId: number,
    consumerParameter: UserCustomParameters
  ) {
    toggleCardState(cardId);
    try {
      updateCardMessage(
        cardId,
        'Ordering dataset & algorithm and starting compute job!'
      );
      const jobId = await startComputeJob(
        datasetDid,
        algoDid,
        config.network.acceptedChainId,
        web3Signer,
        consumerParameter
      );
      console.log('Compute job started: ', jobId);
      updateCardMessage(
        cardId,
        `Compute job started: ${jobId} , Running algorithm ...`
      );
      const jobFinished = await waitForJobToFinish(
        datasetDid,
        jobId,
        config.network.acceptedChainId,
        web3Signer
      );
      console.log('Job finished: ', jobFinished);
      updateCardMessage(cardId, `Compute job finished!`);
      for (let index = 0; index < jobFinished.results.length; index++) {
        const file = jobFinished.results[index];
        if (file.type === 'output') {
          updateCardMessage(cardId, ` Downloading results ...`);
          await downloadJobResults(
            jobId,
            index,
            config.network.acceptedChainId,
            web3Signer
          );
          toggleCardState(cardId);
        }
      }
    } catch (error) {
      LoggerInstance.error('[start compute job] ', error.message);
      toast.error(`Download report error]: ${error.message}`);
      toggleCardState(cardId);
    }
  }

  return (
    <div className={cx(styles.background)}>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap28">
        {DubaiCardData.map((card: CardPropType) => {
          return (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              imageSrc={card.image}
              text={card.text}
              price={card.price}
              loading={loadingStates['dubaiLoading' + card.id]}
              optionsDropdown={
                initialStatesDropdownRealEstate['dropdown' + card.id]
              }
              computeReportResults={downloadReport}
              datasetDid={card.datasetDid}
              algorithmDid={card.algoDid}
              outputMessage={messagesStates['dubaiMessage' + card.id]}
            />
          );
        })}
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
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap28">
        {AlgoProcessingCardData.map((card: CardPropType) =>
          card.id === 4 ? (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              imageSrc={card.image}
              text={card.text}
              price={card.price}
              loading={loadingStates['algoProcessingLoading' + card.id]}
              optionsDropdown={
                initialStatesImageProcessingDropdown['dropdown' + card.id]
              }
              computeReportResults={downloadReport}
              datasetDid={card.datasetDid}
              algorithmDid={card.algoDid}
              outputMessage={messagesStates['algoProcessingMessage' + card.id]}
            />
          ) : (
            <Card
              key={card.id}
              id={card.id}
              title={card.title}
              imageSrc={card.image}
              text={card.text}
              price={card.price}
              loading={loadingStates['algoProcessingLoading' + card.id]}
              optionsDropdown={null}
              computeReportResults={downloadReport}
              datasetDid={card.datasetDid}
              algorithmDid={card.algoDid}
              outputMessage={messagesStates['algoProcessingMessage' + card.id]}
            />
          )
        )}
      </div>
    </div>
  );
}
