import { useRef } from 'react';
import { useMagnetic } from '../hooks';

export default function MagneticLink({ children, ...props }) {
  const ref = useRef(null);
  useMagnetic(ref);
  return <a ref={ref} {...props}>{children}</a>;
}
