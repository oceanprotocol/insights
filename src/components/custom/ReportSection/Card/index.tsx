import react, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Image, { StaticImageData } from "next/image";
import useData from "./useData";
import cx from "classnames";
import useOptionsDropdown from "../Dropdown/DropdownData";

import styles from "./styles.module.scss";
import Dropdown from "../Dropdown/index";

const Card = () => {
  const { t } = useTranslation(["common"]);
  const { DubaiCardData, TwitterCardData } = useData();
  const { DropdownData } = useOptionsDropdown();
  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
        {DubaiCardData.map((card) => {
          return (
            <div key={card.title}>
              <div
                className="play30 text-white mx-3 mb-3 mb-md-0 d-flex justify-content-center"
                key={card.id}
              >
                {card.title}
              </div>
              <div className="mx-3" key={card.id}>
                <div className={cx(styles.card)} key={card.id}>
                  <Image
                    src={card.image}
                    alt="image"
                    width={0}
                    height={0}
                    className={cx(styles.image)}
                  />
                  <div className={cx(styles.text, 'play10 text-justify')}>
                    {card.text}
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <Dropdown placeholder="Location" options={DropdownData} />
                    <Dropdown placeholder="Location" options={DropdownData} />
                  </div>
                  <div className="d-flex flex-row justify-content-end align-items-center">
                    <div className="playb15 me-2">{card.price}</div>
                    <button className={cx(styles.button, 'play15')}>
                      {t('buttonDownload')}
                    </button>
                  </div>
                  <div
                    className={cx(
                      styles.download,
                      'play12 d-flex justify-content-end'
                    )}
                  >
                    {card.download}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cx(styles.margin, "play40 text-white text-center")}>
        {t("titleTwitter")}
      </div>
      <div
        className={cx(styles.marginSubtitle, "play20 text-white text-center")}
      >
        {t("titleUpdate")}
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-center">
        {TwitterCardData.map((card) => {
          return (
            <div
              className="d-flex flex-column align-items-center"
              key={card.title}
            >
              <div
                className="play30 text-white mx-3 mb-3 mb-md-0 d-flex justify-content-center"
                key={card.id}
              >
                {t(`${card.title}`)}
              </div>
              <div className="mx-3" key={card.id}>
                <div className={cx(styles.card)} key={card.id}>
                  <Image
                    src={card.image}
                    width={0}
                    height={0}
                    alt="image"
                    className={cx(
                      styles.image,
                      'd-flex justify-content-center'
                    )}
                  />
                  <div className={cx(styles.text, 'play10 text-justify')}>
                    {card.text}
                  </div>
                  <div className="d-flex flex-row justify-content-center">
                    <Dropdown placeholder="Location" options={DropdownData} />
                    <Dropdown placeholder="Location" options={DropdownData} />
                  </div>
                  <div className="d-flex flex-row justify-content-end align-items-center">
                    <div className="playb15 me-2">{card.price}</div>
                    <button className={cx(styles.button, 'play15')}>
                      {t('buttonDownload')}
                    </button>
                  </div>
                  <div
                    className={cx(
                      styles.download,
                      'play12 d-flex justify-content-end'
                    )}
                  >
                    {card.download}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Card;
