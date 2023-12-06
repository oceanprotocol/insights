import React, { ReactElement } from 'react';
import styles from './Empty.module.css';
import { markdownToHtml } from '../../../shared/@ocean/utilities/markdown';

export default function Empty({ message }: { message?: string }): ReactElement {
  return (
    <div
      className={styles.empty}
      dangerouslySetInnerHTML={{
        __html: markdownToHtml(message) || 'No results found',
      }}
    />
  );
}
