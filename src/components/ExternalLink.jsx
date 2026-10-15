import { isSafeExternalUrl } from '../lib/security';

/** Opens https links in a new tab with safe rel values. Anything else is rendered as plain text. */
export default function ExternalLink({ href, children, ...props }) {
  if (!isSafeExternalUrl(href)) return <span {...props}>{children}</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
}
