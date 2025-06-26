import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './Button';

export default {
  title: 'Common/Button',
  component: Button,
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: ['primary', 'secondary', 'outline', 'danger'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    loading: {
      control: {
        type: 'boolean',
      },
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
    },
    onClick: { action: 'clicked' },
  },
} as Meta<ButtonProps>;

export const Default: StoryObj<ButtonProps> = {};

export const Primary: StoryObj<ButtonProps> = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: StoryObj<ButtonProps> = {
  args: {
    variant: 'secondary',
  },
};

export const Outline: StoryObj<ButtonProps> = {
  args: {
    variant: 'outline',
  },
};

export const Danger: StoryObj<ButtonProps> = {
  args: {
    variant: 'danger',
  },
};

export const Loading: StoryObj<ButtonProps> = {
  args: {
    loading: true,
  },
};

export const FullWidth: StoryObj<ButtonProps> = {
  args: {
    fullWidth: true,
  },
};
