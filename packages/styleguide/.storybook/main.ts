import { resolve } from 'path';

export default {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.s?css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
    },
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  features: {
    storyStoreV7: true,
    buildStoriesJson: true,
    babelModeV7: true,
    modernInlineRender: true,
  },
  docs: {
    autodocs: true,
    docsPage: true,
  },
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async config => {
    const cwd = process.cwd();

    const node_modules = resolve(cwd, '../../node_modules');

    config.module.rules.push({
      test: /\.tsx?$/u,
      include: resolve('../ui/'),
      exclude: /node_modules/u,
      loader: resolve(node_modules, 'ts-loader'),
    });

    return config;
  },
};
