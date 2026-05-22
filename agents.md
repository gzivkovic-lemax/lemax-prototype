# Lemax Prototype — Agent guide

## What this project is

A lightweight Angular sandbox that **product managers use to mock up new functionality for the Lemax travel-operations product**. It is **not** the real Lemax codebase — it is a visual + interaction prototype that PMs use to sketch flows, hand designs to engineering, and validate ideas without touching production.

The reference UI being mimicked is the iTravel / Lemax admin (`presentationdemo.itravelsoftware.com`, `app.lemax.net`). When the PM says "make X look like Lemax", that means: solid blue topbar, dense data grids with light-blue header rows, floating modal windows with blue chrome, small rectangular status chips, magenta-red primary action buttons.

## How to read this guide

If you are a coding agent (Claude Code, Cursor, Codex, etc.), this is the source of truth for working on this repo. `CLAUDE.md` is a thin pointer to this file. Read this first; only consult the code when you need details these notes don't cover.

## Stack & architecture

- **Angular 20**, standalone components (no NgModules), `signal()` / `computed()` for state.
- Templates use the legacy `*ngIf` / `*ngFor` control flow — keep that style, don't migrate to `@if` / `@for`.
- Routing: `src/app/app.routes.ts`, mounted under `LemaxShellComponent`.
- Persistence: `StorageService` (`src/app/storage.service.ts`) is the **only** wrapper around `localStorage`. Don't call `localStorage` directly anywhere else.
- Data flow: each entity has a repository service exposing a `signal<T[]>` and persisting changes through `StorageService`. Components inject the repo and read the signal.
- No HTTP backend. The only network call is the seed-data fetch on first load (`AppDataInitializerService` reads JSON from `public/`).

## Folder map (`src/app`)

| File | Role |
| --- | --- |
| `lemax-shell.component.*` | Topbar (logo, primary nav, **Reset all data**, search, user avatar) + `<router-outlet>` + window layer. |
| `app.routes.ts` | All top-level routes — Reservations, Operations, Documents, Finances, Products, Partners, Reports, Options. |
| `app.config.ts` | Bootstraps `provideHttpClient`, `provideRouter`, and runs `AppDataInitializerService.initialize()` via `APP_INITIALIZER`. |
| `app-data-initializer.service.ts` | Seeds reservation/customer/product/status/filter data from `public/*.json` on first load (controlled by `SEED_DATA_VERSION`). |
| `app-data-reset.service.ts` | Wipes every prototype-owned localStorage key, re-runs the seed, and refreshes every repo. Wired to the **Reset all data** button. |
| `storage.service.ts` | Minimal localStorage wrapper. `STORAGE_KEYS` enumerates the keys used by core entities. |
| `reservation-repository.service.ts` | Reservations: load, save, **duplicate**, refresh. |
| `customer-repository.service.ts`, `product-repository.service.ts`, `reservation-status-repository.service.ts`, `filter-options-repository.service.ts` | Read-only repos for their respective entities. Each exposes `refresh()` for the reset flow. |
| `prototype-data-repository.service.ts` | Single localStorage-backed store for the **prototype-only** list pages: Customers (Partners), Offers (Documents), Accommodation (Products), Operations report. Holds an in-memory seed; lists are exposed as `computed()` signals. |
| `window-manager.service.ts` | Floating-window stack (open / focus / close / move / restore). Reservation windows open at ~95% of viewport. |
| `window-layer.component.ts` | Renders the backdrop + every open `<app-floating-window>`. **ESC** closes the topmost window; clicking the backdrop closes it too. |
| `floating-window.component.ts` | Draggable window chrome — blue header with title + refresh / minimize / maximize / close icons. |
| `reservation-editor-window.component.ts` | Tabbed reservation form (General / Activity / Custom fields / …). **OK saves and closes**, **Create template** is the secondary outline button. |
| `customer-detail-window.component.ts`, `product-detail-window.component.ts` | Read-only detail panes shown inside a floating window. |
| `reservations-page.component.*` | Main reservations grid: filters, table, status badges, row actions (edit / delete / **copy** / more). The **reservation-number badge** is itself the click target for opening the editor. |
| `customers-page.component.ts`, `offers-page.component.ts`, `accommodation-page.component.ts`, `operations-report-page.component.ts` | Prototype list pages. They render rows from `PrototypeDataRepository`. |
| `placeholder-page.component.ts` | Generic stand-in for not-yet-built modules (Finances, Reports, Options). |
| `status-badge.component.ts` | Small rectangular status chip — `inquiry` / `option` / `confirmed` / `finished` / `cancelled`. Optional Material Icons icon (e.g. `check_circle`, `schedule`). |

## Lemax design tokens

Defined in `src/styles.css` as CSS custom properties. **Use the variables, not raw hex codes** unless the variable doesn't cover what you need.

- Brand: `--lemax-blue` `#00a6e5`, `--lemax-blue-dark` `#0085b7`, `--lemax-blue-soft` `#eefaff`.
- Action (primary CTAs — Group actions / OK / New customer): `--lemax-action` `#e8345a`, `--lemax-action-dark` `#c52349`.
- Text / borders: `--lemax-text` `#0a2b45`, `--lemax-muted` `#6b778c`, `--lemax-border` `#c1c7d0`, `--lemax-border-soft` `#ebeef2`.
- Grid header tint: `--lemax-header-row` `#eaf5fb`. Row hover: `--lemax-row-hover`.
- Status palette: `--status-confirmed-*`, `--status-option-*`, `--status-inquiry-*`, `--status-finished-*`, `--status-cancelled-*`.

Shared utility classes also live in `src/styles.css`: `.lmx-btn` (`--blue` / `--action` / `--action-outline` / `--ghost`), `.lmx-input`, `.lmx-select`, `.lmx-card`, `.lmx-icon-btn`, `.lmx-page-title`, `.lmx-checkbox`. There is also a shared list-page rule set: `.lmx-list-page`, `.lmx-filter-card`, `.lmx-grid-card`, `.lmx-data-grid`, `.lmx-row-actions`. **Reuse these** before adding new ones.

Font: Inter. Material Icons are loaded from Google Fonts in `src/index.html` and used via `<span class="material-icons">{name}</span>`.

## Patterns to follow

### Adding a new prototyped list page

1. Add the row interface and seed array to `PrototypeDataRepository` (`prototype-data-repository.service.ts`). Keep the seed plain so the **Reset all data** flow can reseed deterministically. Bump `SEED_VERSION` if you reshape an existing list.
2. Create `<feature>-page.component.ts` that injects `PrototypeDataRepository` and reads the signal.
3. Use the shared `.lmx-list-page` / `.lmx-filter-card` / `.lmx-data-grid` styles; only add component-scoped CSS for layout that's specific to that page.
4. Wire the route in `app.routes.ts` and add a `<a routerLink>` in `lemax-shell.component.ts` if it's a new top-level module.

### Adding a real entity (with edit/save flows)

1. Add the type to `models.ts`.
2. Create `<entity>-repository.service.ts` that mirrors `ReservationRepository` (signal, `getById`, `save`, `refresh`, persist through `StorageService`).
3. Add a key to `STORAGE_KEYS` in `storage.service.ts` and a seed JSON file in `public/` plus an entry in `AppDataInitializerService.initialize()`.
4. Bump `SEED_DATA_VERSION` when changing the shape so existing browsers re-seed.
5. Add the repository to `AppDataResetService` (inject + call `refresh()` after re-init) so **Reset all data** keeps it in sync.

### Grid edit interactions

Every grid that exposes an Edit action must open the edit screen as a floating window via `WindowManagerService.open()` — never navigate to a route. Two gestures must both trigger the same open call:

1. **Pencil icon click** — a `.lmx-icon-btn` with `edit` Material Icon in the row-actions cell.
2. **Row double-click** — a `(dblclick)` handler on the `<tr>` (or equivalent row element).

Both gestures pass the same entity id and open mode. The pencil icon click must call `$event.stopPropagation()` so it doesn't also fire the row's `dblclick` handler.

### Opening a detail / edit window

Always use `WindowManagerService.open(kind, entityId, title, mode)` — never route to a new page.

```
this.windowManager.open('reservation', reservationId, `Reservation details (${number})`, 'edit');
```

The window stack handles z-index, focus, drag, persistence across reloads, ESC-to-close, and backdrop-click-to-close. Saving a reservation should close the window via `windowManager.close(this.windowId)`.

## Conventions

- **Visual fidelity over Angular elegance.** This is a comp tool. Match the Lemax screenshots even if it means denser markup.
- **Don't introduce a CSS / UI framework.** Hand-rolled CSS only.
- **Small diffs.** Don't add unrelated cleanup. PMs review these by eye.
- **No new dependencies** without a clear reason. The package.json should stay tiny.
- **No comments unless the why is non-obvious.**
- **Keep the prototype seed deterministic** — every list and form should look the same after **Reset all data**.

## Things this prototype does that the real Lemax does NOT

- The `Reset all data` button (intentionally — PMs need to throw away their playthrough).
- Reservation `Copy` button: clones the row, increments the number, opens the new copy in the editor.
- ESC + backdrop-click closing the topmost window.

These are prototype-only conveniences. Don't claim parity with production behavior.

## Running

```
npm start          # ng serve, http://localhost:4200
npm run build      # production build into dist/
```

## When you're handed a PM-style task

1. Read this file, then the relevant component.
2. If you need data, check `PrototypeDataRepository` first — adding to that is usually enough.
3. Match the Lemax screenshot (the user normally pastes one). The shared `.lmx-*` classes already get you 80% of the way.
4. Verify with `npm run build` before claiming done.
5. If the task touches a flow with state (open windows, in-progress edits), make sure **Reset all data** still cleans it up.
