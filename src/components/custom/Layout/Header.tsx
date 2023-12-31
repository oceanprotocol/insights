import React, { useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import styles from './styles.module.scss';
import profile from '../../../assets/profile.svg';
import logo from '../../../assets/logo.svg';
import Wallet from '../Wallet';
import config from '../../../../config';

import ConnectButton from '../ConnectButton';
import { useWalletContext } from '../../../shared/@ocean/context/WalletContext';
import Link from 'next/link';

const Navigation = () => {
  const Profile = config.routes.profile;
  const { user } = useWalletContext();
  return (
    <div className="d-flex flex-column flex-md-row align-center">
      <div>{!user ? <ConnectButton /> : <Wallet />}</div>
      <div className="d-flex flex-row align-center order-0 order-md-1">
        <Link
          className="me-3 bg-transparent border-0 d-flex align-items-center"
          href={Profile}
          prefetch
        >
          <Image src={profile} width={20} height={20} alt="profile" />
        </Link>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <Link href="/">
      <Image src={logo} alt="logo" />
    </Link>
  );
};

const Mobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = (menuState: boolean) => {
    setIsMenuOpen(!menuState);
  };

  const Profile = config.routes.profile;

  return (
    <nav className="navbar navbar-dark fixed-top">
      <div className="container d-flex flex-row justify-content-between align-items-center">
        <Logo />
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={() => handleMenuToggle(isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          className={cx(styles.heightNav, 'collapse navbar-collapse', {
            show: isMenuOpen,
          })}
          id="navbarNav"
        >
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link scroll-link" href="#top-content">
                <Link
                  className={cx(styles.profileCard, 'd-flex flex-row')}
                  href={Profile}
                >
                  <Image src={profile} width={20} height={20} alt="profile" />
                  <div className="ms-3">Profile</div>
                </Link>
              </a>
            </li>
            <div className="nav-item d-flex flex-row justify-content-between">
              <Wallet />
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Header: NextPage = () => {
  const { t } = useTranslation(["common"]);

  return (
    <>
      <div
        className={cx(
          styles.headerStyle,
          "d-none d-md-flex flex-row justify-content-between"
        )}
      >
        <Logo />
        <Navigation />
      </div>
      <div className={cx(styles.headerMobile, "d-flex d-md-none")}>
        <Mobile />
      </div>
    </>
  );
};

export default Header;
