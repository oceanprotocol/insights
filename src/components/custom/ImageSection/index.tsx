import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import cx from 'classnames';

import styles from "./style.module.scss";
import prev from '../../../assets/preview.svg'

export default function ImageSection() {
    const { t } = useTranslation(["common"])

    return (
        <div className={cx(styles.blackBg)}>
            <div className={cx(styles.background)}>
                <div className={cx(styles.paddingText, "text-white d-flex flex-column justify-content-center text-center")}>
                    <div className="play40">{t('dubai')}</div>
                    <div className="play20">{t('update')}</div>
                </div>
                <div className="d-flex justify-content-center justify-content-md-end me-2">
                    <div className={cx(styles.preview, "d-flex flex-row justify-content-center align-items-center")}>
                        <div className="me-2 play20">{t('preview')}</div>
                        <Image src={prev}  alt="preview" width={20} height={20}/>
                    </div>
                </div>
            </div>
        </div>
    )
}