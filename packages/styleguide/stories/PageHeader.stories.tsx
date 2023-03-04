import { Meta, StoryObj } from '@storybook/react';

import { PageHeader } from 'ui';

export default {
  title: 'PageHeader',
  component: PageHeader,
  tags: ['docsPage'],
} as Meta<typeof PageHeader>;

export const Primary: StoryObj<typeof PageHeader> = {
  args: {
    children: 'Sample Header',
  },
};
