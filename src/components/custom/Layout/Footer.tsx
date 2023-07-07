import React from "react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import cx from "classnames";

import styles from "./styles.module.scss";
import Button from "../Button";
import logo from "../../../assets/logo.svg";

const Navigation = () => {
const { t } = useTranslation(["common"])

  return (
    <div className="d-flex flex-column align-items-center align-items-md-start justify-content-start text-white me-0 me-md-5 mb-3 mb-md-0">
      <Button className="poppins14 bg-transparent border-0 text-white">
        <Link href="">{t('footer.computeLink')}</Link>
      </Button>
      <Button className="poppins14 bg-transparent border-0 text-white">
        <Link href="">{t('footer.aboutLink')}</Link>
      </Button>
      <Button className="poppins14 bg-transparent border-0 text-white">
        <Link href="">{t('footer.pressLink')}</Link>
      </Button>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="d-flex justify-content-center my-5 my-md-0">
      <Image src={logo} alt="logo"/>
    </div>
  )
}

const Footer: NextPage = () => {
  const { t } = useTranslation(["common"]);

  return <div className={cx(styles.footerStyle, "d-flex flex-column flex-md-row justify-content-between text-center text-md-start")}>
    <Logo />
    <Navigation />
    <div className="poppins14 text-white mb-5 mb-md-0">© {new Date().getFullYear()}{t('footer.reserved')}</div>
  </div>;
};

export default Footer;