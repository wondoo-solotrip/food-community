import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
          {
            // addon-vitest compares the browser's percent-encoded module URL against
            // the raw filesystem path, which never matches when the project path
            // contains non-ASCII characters (this repo lives under "무제폴더/").
            // Decode the URL first, otherwise every story fails with
            // "No test suite found in file".
            name: 'storybook:decode-non-ascii-story-url',
            transform: {
              order: 'post',
              handler(code: string) {
                if (!code.includes('convertToFilePath(import.meta.url)')) return;
                return {
                  code: code.replace(
                    'convertToFilePath(import.meta.url)',
                    'decodeURIComponent(convertToFilePath(import.meta.url))',
                  ),
                  map: null,
                };
              },
            },
          },
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
