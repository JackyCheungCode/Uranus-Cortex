# Component specifications and frontend rules

Every control documents purpose, API, variants/sizes, states, keyboard/screen-reader behavior, responsive behavior, token dependencies, examples, tests, and accessibility evidence.

## Implemented: Button

- Location: `src/design-system/components/Button`.
- Import: `import { Button } from './design-system/components/Button';`.
- Variants: `primary` (default), `secondary`, `tertiary`, `danger`.
- Sizes: `sm`, `md` (default), `lg`.
- States/options: native `disabled`, `loading`, `fullWidth`, standard native button attributes, `className`.
- The default `type` is `button`; specify `type="submit"` for form submission.
- Loading disables repeated activation, exposes `aria-busy`, and hides the decorative spinner from assistive technology.
- Native button keyboard behavior is preserved. Visible focus is provided by the shared token stylesheet.
- Styling consumes Uranus semantic tokens; avoid raw colors in component styles.

## Implemented: Input

- Location: `src/design-system/components/Input`.
- Import: `import { Input } from './design-system/components/Input';`.
- API: native input attributes plus `label`, `helperText`, `error`, `size`, `fullWidth`, `leadingAdornment`, and `trailingAdornment`.
- Sizes: `sm`, `md` (default), `lg`; full width is enabled by default.
- Native `required`, `disabled`, `readOnly`, `type`, `name`, `value`, and `onChange` attributes are supported.
- A provided visible label is explicitly associated with the input. If a visible label is omitted, callers must provide `aria-label` or `aria-labelledby`; placeholder is not a substitute for a label.
- Helper and error text are linked with `aria-describedby`; an error sets `aria-invalid` and is exposed through an alert region.
- Adornments are decorative and hidden from assistive technology; do not put interactive controls inside them.
- Styling consumes Uranus semantic tokens and preserves native input behavior. The visual treatment is underline-only: no surrounding box, with blue focus underline and red validation underline.

## Verification status

The repository file contents and component exports were checked through GitHub. Automated component tests have not yet been added. A local TypeScript check and production build have not been run in this environment; do not treat the components as build-verified until `npm run typecheck` and `npm run build` pass.

## Planned controls

Priority: TextArea/Select/Checkbox/Radio/Switch; FormField/validation; Loading/Progress; Notification/InlineAlert; Dialog/Drawer; DataTable/sorting/selection/Pagination; Tabs/Breadcrumb/DropdownMenu/Tooltip; DatePicker/file upload after requirements are specified.

Controls live in `src/design-system/components`, page patterns in `src/design-system/patterns`, domain UI in the owning `src/modules/<module>`, and generic utilities in `src/shared`. Business modules use local controls, not Carbon directly. Keep domain rules out of visual primitives and avoid private imports across modules.

Existing Carbon imports are legacy; do not remove dependencies until migrated. Review keyboard, focus, screen-reader, responsive, loading, empty, and error states. Report checks not run.
