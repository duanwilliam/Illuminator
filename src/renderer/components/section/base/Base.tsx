import clsx from 'clsx';
import React from 'react';
import { GridSectionProps, hGroups, vGroups } from '../groups';

import styles from './styles.scss';

interface BaseProps extends GridSectionProps {
  className?: string;
}

const Base: React.FC<BaseProps> = ({
  className,
  children,
  hStart,
  hEnd,
  vStart,
  vEnd,
}) => {
  return (
    <div
      className={clsx(
        styles.base,
        styles[`start-${hGroups[hStart]}`],
        styles[`end-${hGroups[hEnd]}`],
        styles[`start-${vGroups[vStart]}`],
        styles[`end-${vGroups[vEnd]}`],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Base;
