import React, { ReactNode, useCallback, useState } from 'react';
import { NextPage } from 'next';
import cx from 'classnames';
import Header from './Header';
import Footer from './Footer';

import styles from './styles.module.scss';

type ActionProps = {
  children: ReactNode;
};

const Layout: NextPage<ActionProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const toggleMenu = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div
      className={cx(
        styles.layoutSize,
        'h-100 d-flex flex-column justify-content-between align-items-stretch'
      )}
    >
      <div className="h-100 d-flex flex-row">
        <div className="w-100">
          <Header />
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
