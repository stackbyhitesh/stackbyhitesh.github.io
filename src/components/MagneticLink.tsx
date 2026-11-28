import { useRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { useMagnetic } from '../hooks';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode };

export default function MagneticLink({ children, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref);
  return <a ref={ref} {...props}>{children}</a>;
}
