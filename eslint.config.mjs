import globals from 'globals';
import pluginJs from '@eslint/js';
import markdown from '@eslint/markdown';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm' }
];
