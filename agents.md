# Lemax Prototype

## What this is

A lightweight Angular sandbox that **product managers use to mock up new functionality for the Lemax travel-operations product**. It's not the real Lemax codebase — it's a visual + interaction prototype where PMs can sketch flows, hand designs to engineering, and validate ideas without touching production.

The reference UI being mimicked is the iTravel/Lemax admin (presentationdemo.itravelsoftware.com / app.lemax.net). When asked to "make X look like Lemax", match that look — solid blue topbar, dense data grids, floating modal windows, status chip badges, magenta-red primary action buttons.

## Stack

- Angular 20 standalone components (no NgModules), signals, control flow via `*ngIf`/`*ngFor` (existing style — not migrated to `@if`/`@for`).
- Routing via `app.routes.ts` mounted under `LemaxShellComponent`.
- State persistence: `StorageService` writes to `localStorage`. There is no backend.
- Repos under `src/app/*-repository.service.ts` are the data layer; `WindowManagerService` tracks the floating-window stack.

## Folder map (src/app)

- `lemax-shell.component.*` — topbar (logo, primary nav, search, user) + outlet + window layer.
- `reservations-page.component.*` — main grid screen (filters, summary, table, row actions).
- `placeholder-page.component.ts` — generic stand-in for not-yet-built modules (Customers, Reports, …).
- `floating-window.component.ts` — draggable Lemax-style window chrome (blue header, action icons).
- `reservation-editor-window.component.ts` — tabbed reservation form rendered inside a floating window.
- `customer-detail-window.component.ts`, `product-detail-window.component.ts` — read-only detail panes.
- `status-badge.component.ts` — small rectangular status chip (Inquiry / Option / Confirmed / Finished / Cancelled).
- `*-repository.service.ts` — typed repos that hydrate from `app-data-initializer.service.ts` and persist via `StorageService`.

## Lemax design tokens (use these, not ad-hoc colors)

Defined in `src/styles.css` as CSS custom properties. Match the values from the iTravel CSS reference (`#0a2b45` text, `#00a6e5` brand blue, `#6b778c` muted, `#c1c7d0` borders, status palette: `#2dca73` confirmed, `#fff0b3` inquiry, `#e3fcef` option, `#8993a4` finished, `#ff3c31` cancelled). Primary action buttons are the Lemax magenta-red (`--lemax-action`), not the brand blue.

Font: Inter. Material Icons are loaded from Google Fonts in `index.html` and used via `<span class="material-icons">name</span>`.

## Conventions

- **Styling**: shared layout/control styles live in `src/styles.css`; per-component cosmetics in component `styleUrl`/`styles`. Don't introduce a CSS framework.
- **Look & feel**: dense, rectangular, Office-2007-grid feel. Avoid the airy gradients and pill buttons that were in the earlier iteration.
- **Data**: any new entity needs a repo + initializer entry; never read/write `localStorage` directly outside `StorageService`.
- **Windows**: open detail/edit views via `WindowManagerService.open(kind, entityId, title, mode)` — do not route to a separate page.
- **No backend calls.** This is a prototype; mock data only.

## Running

```
npm start         # ng serve, http://localhost:4200
npm run build     # production build into dist/
```

## When making changes for a PM

- Bias toward visual fidelity with the real Lemax UI over Angular best practices — this is a comp tool.
- Keep new screens reachable from the primary nav; use `PlaceholderPageComponent` if the screen isn't built out.
- Don't add features the PM didn't ask for. Keep the diff small and the change reviewable.
