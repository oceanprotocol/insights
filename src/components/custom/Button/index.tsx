import react, { FormEvent, ReactNode } from 'react';
import Link from 'next/link';

type ButtonPropsType = {
  href?: string;
  path?: string;
  children: ReactNode;
  className?: string;
  transparent?: boolean;
  disabled?: boolean;
  onClick?: (e: FormEvent) => void;
};

export default function Button({
  onClick,
  href,
  path,
  children,
  className,
  disabled,
  transparent,
}: ButtonPropsType) {
  return path ? (
    <Link href={path} className={className} onClick={onClick}>
      {children}
    </Link>
  ) : href ? (
    <a
      href={href}
      className={className}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
