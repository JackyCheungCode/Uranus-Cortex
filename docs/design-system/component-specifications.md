# Component specifications and frontend rules
This is a specification baseline; it does not claim controls are implemented.

Every control documents purpose, API, variants/sizes, states, keyboard/screen-reader behavior, responsive behavior, token dependencies, examples, tests, and accessibility evidence.

Priority: Button/IconButton; Input/TextArea/Select/Checkbox/Radio/Switch; FormField/validation; Loading/Progress; Notification/InlineAlert; Dialog/Drawer; DataTable/sorting/selection/Pagination; Tabs/Breadcrumb/DropdownMenu/Tooltip; DatePicker/file upload after requirements are specified.

Controls live in `src/design-system/components`, page patterns in `src/design-system/patterns`, domain UI in the owning `src/modules/<module>`, generic utilities in `src/shared`. Business modules use local controls, not Carbon directly. Keep domain rules out of visual primitives and avoid private imports across modules.

Existing Carbon imports are legacy; do not remove dependencies until migrated. Run `npm run typecheck` and `npm run build`; add tests as the strategy is established. Review keyboard, focus, screen-reader, responsive, loading, empty, and error states. Report checks not run.
