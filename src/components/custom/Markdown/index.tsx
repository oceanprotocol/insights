import React, { ReactElement } from 'react';
import { markdownToHtml } from '../../../shared/@ocean/utilities/markdown';
import styles from './index.module.scss';

const Markdown = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}): ReactElement => {
  const content = markdownToHtml(text);

  return (
    <div
      className={`${styles.markdown} ${className}`}
      // Note: We serialize and kill all embedded HTML over in markdownToHtml()
      // so the danger here is gone.
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default Markdown;
