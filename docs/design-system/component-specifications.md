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
- Automated component tests have not yet been added; run typecheck/build and manually verify keyboard focus, disabled/loading behavior, and contrast before production use.

## Planned controls

Priority: Input/TextArea/Select/Checkbox/Radio/Switch; FormField/validation; Loading/Progress; Notification/InlineAlert; Dialog/Drawer; DataTable/sorting/selection/Pagination; Tabs/Breadcrumb/DropdownMenu/Tooltip; DatePicker/file upload after requirements are specified.

Controls live in `src/design-system/components`, page patterns in `src/design-system/patterns`, domain UI in the owning `src/modules/<module>`, and generic utilities in `src/shared`. Business modules use local controls, not Carbon directly. Keep domain rules out of visual primitives and avoid private imports across modules.

Existing Carbon imports are legacy; do not remove dependencies until migrated. Run `npm run typecheck` and `npm run build`; add tests as the strategy is established. Review keyboard, focus, screen-reader, responsive, loading, empty, and error states. Report checks not run.
