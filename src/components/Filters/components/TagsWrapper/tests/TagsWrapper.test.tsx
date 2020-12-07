import React from 'react';
import {mountWithApp} from 'test-utilities';

import {TagsWrapper} from '../TagsWrapper';
import {VisuallyHidden} from '../../../../VisuallyHidden';

const MockChild = () => <div />;

describe('<TagsWrapper />', () => {
  it('renders visually hidden component when shouldHide is true', () => {
    const tagsWrapper = mountWithApp(
      <TagsWrapper shouldHide>
        <MockChild />
      </TagsWrapper>,
    );

    expect(tagsWrapper).toContainReactComponentTimes(VisuallyHidden, 1);
    expect(tagsWrapper).toContainReactComponentTimes(MockChild, 1);
  });

  it('renders children directly when shouldHide is false', () => {
    const tagsWrapper = mountWithApp(
      <TagsWrapper shouldHide={false}>
        <MockChild />
      </TagsWrapper>,
    );

    expect(tagsWrapper).not.toContainReactComponent(VisuallyHidden);
    expect(tagsWrapper).toContainReactComponentTimes(MockChild, 1);
  });
});
