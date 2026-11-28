import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { isSafeExternalUrl } from '../lib/security';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

/** Opens https links in a new tab with safe rel values. Anything else is rendered as plain text. */
export default function ExternalLink({ href, children, className, ...props }: Props) {
  if (!isSafeExternalUrl(href)) return <span className={className}>{children}</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>{children}</a>;
}
