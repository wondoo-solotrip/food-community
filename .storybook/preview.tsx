import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Foundation',
          ['Design Tokens', 'Colors', 'Typography', 'Iconography'],
          'UI',
          [
            // Action
            'Button',
            'Icon Button',
            // Form
            'Text Field',
            'Textarea',
            'Checkbox',
            'Radio',
            'Switch',
            'Select',
            'Select Item',
            'Chip',
            'File Uploader',
            // Navigation
            'Top Navigation',
            'Bottom Navigation',
            'Tab Navigation',
            // Feedback
            'Spinner',
            'Skeleton',
            'Toast',
            // Etc
            'Card',
            'Badge',
            'Empty',
            'Modal',
            'Bottom Sheet',
            'Menu',
          ],
          'Example',
        ],
      },
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;