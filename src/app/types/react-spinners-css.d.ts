declare module 'react-spinners-css' {
  import * as React from 'react';

  export interface SpinnerProps {
    color?: string;
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }

  export const Ring: React.FC<SpinnerProps>;
  export const Ellipsis: React.FC<SpinnerProps>;
  export const Ripple: React.FC<SpinnerProps>;
  export const DualRing: React.FC<SpinnerProps>;
  export const Facebook: React.FC<SpinnerProps>;
  export const Heart: React.FC<SpinnerProps>;
  export const Grid: React.FC<SpinnerProps>;
  export const Circle: React.FC<SpinnerProps>;
  export const Default: React.FC<SpinnerProps>;
}
