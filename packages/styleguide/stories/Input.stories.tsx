import { Meta, StoryObj } from '@storybook/react';

import { Button, Input } from 'ui';

export default {
  title: 'Input',
  component: Input,
  tags: ['docsPage'],
  argTypes: {
    type: {
      options: ['text', 'number', 'password', 'email', 'search'],
      control: { type: 'radio' },
    },
    required: {
      control: { type: 'boolean' },
    },
    onChange: { action: 'changed' },
  },
} as Meta<typeof Input>;

export const Primary: StoryObj<typeof Input> = {};

export const Labeled: StoryObj<typeof Input> = {
  args: {
    label: 'Email',
  },
};

export const Required: StoryObj<typeof Input> = {
  args: {
    label: 'Required',
    description: 'This field is required.',
    required: true,
  },
  render: args => {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <Input {...args} />
        <Button type="submit">Submit</Button>
      </form>
    );
  },
};

export const Pattern: StoryObj<typeof Input> = {
  args: {
    label: 'Pattern',
    description: 'This field must contain only letter and numbers.',
    pattern: '^[a-zA-Z0-9]+$',
  },
  render: args => {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <Input {...args} />
        <Button type="submit">Submit</Button>
      </form>
    );
  },
};

export const TypePassword: StoryObj<typeof Input> = {
  args: {
    label: 'Password',
    type: 'password',
    value: 'password',
  },
};

export const TypeNumber: StoryObj<typeof Input> = {
  args: {
    label: 'Number',
    type: 'number',
    value: 0,
  },
};

export const TypeEmail: StoryObj<typeof Input> = {
  args: {
    label: 'Email',
    type: 'email',
    value: 'test@example.com',
  },
};

export const TypeSearch: StoryObj<typeof Input> = {
  args: {
    label: 'Search',
    type: 'search',
    value: 'test',
  },
};

export const WithPlaceholder: StoryObj<typeof Input> = {
  args: {
    label: 'Placeholder',
    placeholder: 'Filter by keyword',
  },
};

export const WithZodError: StoryObj<typeof Input> = {
  args: {
    label: 'Zod Error',
    name: 'username',
    value: '123',
    errors: { username: ['Must contain only letters.'] },
  },
};

export const WithMultipleZodErrors: StoryObj<typeof Input> = {
  args: {
    label: 'Multiple Zod Errors',
    name: 'username',
    value: '123',
    errors: {
      username: [
        'Must contain only letters.',
        'Must be longer than 2 characters.',
      ],
    },
  },
};
