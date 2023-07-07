import react, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";

import styles from "./styles.module.scss";
import Card from './Card/index';

export default function Report() {
  const { t } = useTranslation(["common"])

  return (
    <div className={cx(styles.background)}>
      <Card/>
    </div>
  )
}
