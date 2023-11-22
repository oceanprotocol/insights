import react, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";

import styles from './style.module.scss';

export default function Hero() {
  const { t } = useTranslation(['common']);

  return (
    <div className={cx(styles.background)}>
      <div className={cx(styles.padding)}>
        <div className="play70 text-white d-flex text-center">
          {t('secure')}
        </div>
        <div className="play36 text-white">{t('compute')}</div>
      </div>
    </div>
  );
}