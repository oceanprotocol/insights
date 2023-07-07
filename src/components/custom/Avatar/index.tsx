import { toDataUrl } from 'myetherwallet-blockies'
import React, { ReactElement } from 'react'
import styles from './index.module.scss';

export interface AvatarProps {
  accountId: string;
  src?: string | null | undefined;
  className?: string;
}

export default function Avatar({
  accountId,
  src,
  className
}: AvatarProps): ReactElement {
  return (
    <img
      className={`${className || ''} ${styles.avatar} `}
      src={src || (accountId ? toDataUrl(accountId) : '')}
      alt="Avatar"
      aria-hidden="true"
    />
  )
}
