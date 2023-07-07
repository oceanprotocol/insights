import React, { ChangeEvent } from 'react';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import styles from './style.module.scss';

type SearchPropType = {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  classNames?: string;
};

export default function Search({ value, onChange, classNames }: SearchPropType) {
  const { t } = useTranslation('common');
  return (
    <input type="search" className={cx(styles.search)} placeholder={t('Search for Datasets') || ''} value={value} onChange={onChange} />
  );
}
