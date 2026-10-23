# Tokens

- `index.css`: primitive palette and semantic tokens; light theme is the default.
- Use semantic names (`--uranus-color-text-primary`) in components, not primitive palette names.
- `../themes/dark.css` provides dark-theme semantic overrides. The application theme switch is not wired yet.
- Keep tokens independent of Carbon's `--cds-*` namespace.
