# Lemax Prototype

The full agent guide is in [`agents.md`](./agents.md). Read it before making changes.

Quick reminders:

- This is a PM prototype, not the real Lemax codebase. Match the Lemax UI from the user's screenshots; visual fidelity beats Angular elegance.
- Persistence is `localStorage` only, via `StorageService`. Every prototype list page reads from `PrototypeDataRepository`; reservations have their own repo with edit/copy flows.
- Detail / edit views open as floating windows via `WindowManagerService.open()`, never as routes. ESC and backdrop-click close the topmost window.
- The **Reset all data** button in the topbar (`AppDataResetService`) re-seeds everything. Any new repo must be wired into it.
- Design tokens and shared `.lmx-*` utility classes live in `src/styles.css`. Use them; don't introduce a CSS framework.
