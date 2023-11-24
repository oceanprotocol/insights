import react, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image, { StaticImageData } from 'next/image';
import cx from 'classnames';

import styles from './styles.module.scss';

import { DropdownData } from '../Dropdown/DropdownData';
import Dropdown from '../Dropdown/index';
import Loader from '../../Loader';
import { Aquarius, UserCustomParameters } from '@oceanprotocol/lib';
import Button from '../../Button';
import CartSVG from '../../../../assets/cart.svg';
import { getOceanConfig } from '../../../../shared/@ocean/utilities/ocean';
import config from '../../../../../config';

type CardPropType = {
  id: number;
  title: string;
  imageSrc: string | StaticImageData;
  text: string;
  price: string;
  loading: boolean;
  optionsDropdown?: DropdownData[];
  computeReportResults?: (
    datasetDid: string,
    algoDid: string,
    cardId: number,
    customParameter?: UserCustomParameters
  ) => void;
  datasetDid?: string;
  algorithmDid?: string;
  outputMessage?: string;
};

const Card = ({
  id,
  title,
  imageSrc,
  text,
  price,
  loading,
  optionsDropdown,
  computeReportResults,
  datasetDid,
  algorithmDid,
  outputMessage,
}: CardPropType) => {
  const { t } = useTranslation(['common']);

  const [selectedValue, setSelectedValue] = useState<UserCustomParameters>();
  const [datasetPrice, setDatasetPrice] = useState<string>();

  const handleDropdownSelect = (value: string) => {
    const customParam = {
      customParamKey: value,
    };
    setSelectedValue(customParam);
  };

  const handleClick = () => {
    computeReportResults &&
      computeReportResults(datasetDid, algorithmDid, id, selectedValue);
  };
  function LoaderArea() {
    return (
      <div className={styles.loaderWrap}>
        <Loader />
        <div
          className={cx(styles.text, 'play12 d-flex justify-content-center')}
        >
          {outputMessage}
        </div>
      </div>
    );
  }

  const oceanConfig = getOceanConfig(config.network.acceptedChainId);

  const getDatasetPrice = useCallback(async () => {
    if (!datasetDid || datasetDid.length < 1) {
      return;
    }

    const aquarius = new Aquarius(
      oceanConfig.metadataCacheUri || 'https://v4.aquarius.oceanprotocol.com/'
    );
    const dataDdo: AssetExtended = await aquarius.waitForAqua(datasetDid);
    if (!dataDdo) {
      return;
    }

    setDatasetPrice(dataDdo?.accessDetails?.price);
  }, [datasetDid, oceanConfig.metadataCacheUri]);

  useEffect(() => {
    getDatasetPrice();
  }, []);

  return (
    <div className={cx(styles.root, 'd-flex flex-column flex-md-row')}>
      <div className={styles.imageBox}>
        <Image
          src={imageSrc}
          alt={title}
          className={styles.image}
          quality={100}
          priority
          fill
        />
      </div>
      <div className={styles.details}>
        <div className={styles.descriptionBox}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.description}>{text}</p>
        </div>
        {loading ? (
          <LoaderArea />
        ) : (
          <div className={styles.actions}>
            <div className={cx(styles.dropdown, 'col-6')}>
              {optionsDropdown ? (
                <Dropdown
                  placeholder={optionsDropdown?.[0].placeholder || 'Option'}
                  options={optionsDropdown}
                  onSelect={handleDropdownSelect}
                />
              ) : (
                <></>
              )}
            </div>
            <Button className={styles.buyBtn} onClick={handleClick}>
              <Image src={CartSVG} alt="cart" />
              <div className={styles.price}>
                {datasetPrice ? `${datasetPrice} OCEAN` : price}
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
