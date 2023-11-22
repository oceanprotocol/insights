import React from "react";
import { NextPage } from "next";
import Image from 'next/image';
import cx from 'classnames';

import styles from './styles.module.scss';
import logo from '../../../assets/logo.svg';
import FooterNavigation from './FooterNavigation';

const Logo = () => {
  return (
    <div className="d-flex justify-content-center my-5 my-md-0">
      <Image src={logo} alt="logo" />
    </div>
  );
};

const Footer: NextPage = () => {
  return (
    <div
      className={cx(
        styles.footerStyle,
        'd-flex flex-column flex-md-row justify-content-between text-center text-md-start'
      )}
    >
      <Logo />
      <FooterNavigation />
    </div>
  );
};

export default Footer;