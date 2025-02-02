// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['dist/*']
  },
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier
)
