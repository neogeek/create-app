import { Meta, StoryObj } from '@storybook/react';

import { within } from '@storybook/testing-library';

import { expect } from '@storybook/jest';

import { Button } from 'ui';

export default {
  title: 'Button',
  component: Button,
  tags: ['docsPage'],
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
    type: {
      options: ['button', 'submit', 'reset'],
      control: { type: 'radio' },
    },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof Button>;

export const Primary: StoryObj<typeof Button> = {
  args: {
    type: 'button',
    children: 'Button',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button')).toHaveTextContent('Button');
  },
};

export const Submit: StoryObj<typeof Button> = {
  args: {
    type: 'submit',
    children: 'Submit',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole('button')).toHaveTextContent('Submit');
  },
};
