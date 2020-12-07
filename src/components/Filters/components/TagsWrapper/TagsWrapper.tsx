import React from 'react';

import {VisuallyHidden} from '../../../VisuallyHidden';

interface Props {
  children: React.ReactNode;
  shouldHide: boolean;
}

export function TagsWrapper({children, shouldHide}: Props) {
  if (shouldHide) {
    return <VisuallyHidden>{children}</VisuallyHidden>;
  }

  return <>{children}</>;
}
