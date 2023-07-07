/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import cx from 'classnames';

import styles from './style.module.scss';
import Hero from '../../custom/HeroSection/index';
import ImageSection from '../../custom/ImageSection/index';
import Report from '../../custom/ReportSection';

const Homepage: NextPage = () => {

  return (
    <div>
      <Hero/>
      <ImageSection/>
      <Report/>
    </div>
  );
};

export default Homepage;
