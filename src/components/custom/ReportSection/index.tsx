import react, { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import styles from './styles.module.scss';

import Card from './Card/index';
import useData, { CardPropType } from './Card/useData';
import useOptionsDropdown from './Dropdown/DropdownData';

export default function Report() {
  const { DubaiCardData, TwitterCardData } = useData();
  const { DropdownData } = useOptionsDropdown();
  const { t } = useTranslation(['common']);
  return (
    <div className={cx(styles.background)}>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
        {DubaiCardData.map((card: CardPropType) => (
          <Card
            id={card.id}
            title={card.title}
            imageSrc={card.image}
            text={card.text}
            price={card.price}
            totalDownloads={card.downloads}
            optionsDropdownLeft={DropdownData}
            optionsDropdownRight={DropdownData}
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
            id={card.id}
            title={card.title}
            imageSrc={card.image}
            text={card.text}
            price={card.price}
            totalDownloads={card.downloads}
            optionsDropdownLeft={DropdownData}
            optionsDropdownRight={DropdownData}
          />
        ))}
      </div>
    </div>
  );
}
