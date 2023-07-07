import React, { ReactElement } from 'react';
import styles from './Help.module.scss';
import Markdown from '../Markdown';

const FormHelp = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}): ReactElement => {
  return (
    <Markdown className={`${styles.help} ${className || ''}`} text={children} />
  );
};

export default FormHelp;
