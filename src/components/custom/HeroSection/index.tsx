import react, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import cx from "classnames";

import styles from "./style.module.scss";
import Search from "../Inputs/Search";
import useData from "./useData"

const Data = () => {
    const { t } = useTranslation(["common"])
    const { TotalData } = useData();
    return (
        <div className="d-flex flex-column flex-md-row text-white text-center">
            {TotalData.map((content) =>{
                return (
                    <div key={content.id} className={cx(styles.marginData, 'play15')}>
                        {content.number} {content.text}
                    </div>
                )
            })}
        </div>
    );
};

export default function Hero() {
    const { t } = useTranslation(["common"])

    return (
        <div className={cx(styles.background)}>
            <div className={cx(styles.padding)}>
                <div className="play70 text-white d-flex text-center">{t('secure')}</div>
                <div className="play36 text-white">{t('compute')}</div>
                <Search/>
                <Data/>
            </div>
        </div>
    )
}