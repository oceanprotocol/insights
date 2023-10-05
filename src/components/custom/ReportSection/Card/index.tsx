import react, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Image, { StaticImageData } from 'next/image';
import cx from 'classnames';

import styles from './styles.module.scss';

import { DropdownData } from '../Dropdown/DropdownData';
import Dropdown from '../Dropdown/index';
import Loader from '../../Loader';

type CardPropType = {
  id: number;
  title: string;
  imageSrc: string | StaticImageData;
  text: string;
  price: string;
  totalDownloads: string;
  loading: boolean
  optionsDropdownLeft?: DropdownData[];
  optionsDropdownRight?: DropdownData[];
  computeReportResults?: (datasetDid: string, algoDid: string) => void;
  datasetDid?: string,
  algorithmDid?: string
};

const Card = ({
  id,
  title,
  imageSrc,
  text,
  price,
  totalDownloads,
  loading,
  optionsDropdownLeft,
  optionsDropdownRight,
  computeReportResults,
  datasetDid,
  algorithmDid
}: CardPropType) => {
  const { t } = useTranslation(['common']);
  const handleClick = () => {
    computeReportResults && computeReportResults(datasetDid, algorithmDid)
  };
  
  function LoaderArea() {
    return (
      <div className={styles.loaderWrap}>
        <Loader />
      </div>
    )
  }

  return (
    <div key={id}>
      <div className="play30 text-white mx-3 mb-3 mb-md-0 d-flex justify-content-center">
        {title}
      </div>
      <div className="mx-3">
        <div className={cx(styles.card)}>
          <Image src={imageSrc} alt={title} className={cx(styles.image)} />
          <div className={cx(styles.text, 'play10 text-justify')}>{text}</div>
          <div className="d-flex flex-row justify-content-center">
            <Dropdown placeholder="Location" options={optionsDropdownLeft} />
            <Dropdown placeholder="Location" options={optionsDropdownRight} />
          </div>
          { loading ? (
              <LoaderArea />
            ) : (
          <div className="d-flex flex-row justify-content-end align-items-center">
            <div className="playb15 me-2">{price}</div>
            <button className={cx(styles.button, 'play15')}  onClick={handleClick}>
              {t('buttonDownload')} 
            </button>
          </div>)
          }
          <div
            className={cx(styles.download, 'play12 d-flex justify-content-end')}
          >
            Downloaded by {totalDownloads} users
          </div>
        </div>
      </div>
    </div>
  );

};

export default Card;
