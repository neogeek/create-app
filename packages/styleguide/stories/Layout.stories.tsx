import { Meta, StoryObj } from '@storybook/react';

import { Layout, PageHeader } from 'ui';

export default {
  title: 'Layout',
  component: Layout,
  tags: ['docsPage'],
} as Meta<typeof Layout>;

export const Primary: StoryObj<typeof Layout> = {
  args: {
    children: (
      <>
        <PageHeader>Sample Layout</PageHeader>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus
          natus quae iure! Voluptatem eveniet explicabo deserunt atque.
          Quibusdam, repellat! Quidem rem iusto illum sequi voluptate assumenda
          saepe, sunt omnis voluptates.
        </p>
      </>
    ),
  },
};
