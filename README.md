# Lemax prototype

A clickable Lemax mock-up that product managers use to sketch new functionality, iterate with Claude Code, and share working previews with clients — **no engineering help required**.

This README is written for non-technical users. If you can double-click a file and copy a folder, you can run this.

---

## Table of contents

1. [What you need](#1-what-you-need)
2. [Get the prototype onto your computer](#2-get-the-prototype-onto-your-computer)
3. [Run the prototype locally](#3-run-the-prototype-locally)
4. [Iterate with Claude Code](#4-iterate-with-claude-code)
5. [Share the prototype with a client (Cloudflare Pages)](#5-share-the-prototype-with-a-client-cloudflare-pages)
6. [Update an already-shared prototype](#6-update-an-already-shared-prototype)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. What you need

- **Windows 10 or 11.** Mac/Linux instructions are not in this guide.
- **Claude Code** installed. If you don't have it yet, get it from <https://claude.com/claude-code>.
- A **Cloudflare account** (free tier is fine) for sharing the prototype with clients. Sign up at <https://dash.cloudflare.com/sign-up>.

You do **not** need Node.js installed up front — `run.bat` will install it for you the first time.

---

## 2. Get the prototype onto your computer

1. Download the project ZIP from GitHub:
   <https://github.com/gzivkovic-lemax/lemax-prototype/archive/refs/heads/main.zip>
   *(Source repo: <https://github.com/gzivkovic-lemax/lemax-prototype>)*

2. Decide on a folder for **this** specific prototype. The recommendation is one folder per feature you're prototyping, so you can keep them side by side. For example:
   - `C:\prototypes\feature-X`
   - `C:\prototypes\new-billing-flow`
   - `C:\prototypes\ops-redesign`

3. Open the downloaded ZIP and **extract its contents into your chosen folder**. After extracting, you should see `package.json`, `run.bat`, `README.md`, an `src` folder, and so on, directly inside `C:\prototypes\feature-X` (no extra `lemax-prototype-main` wrapper folder).

   > Tip: when Windows extracts a ZIP it sometimes nests the files inside a folder named after the ZIP. If that happens, copy the contents of the inner folder up one level so `run.bat` is at the top of your prototype folder.

---

## 3. Run the prototype locally

1. Open the prototype folder in File Explorer.
2. Double-click **`run.bat`**.
3. The first time you run it, you may see:
   - A black/blue PowerShell window with progress messages.
   - A Windows User Account Control prompt asking to install Node.js — **click Yes**.
   - A few minutes of "Installing project dependencies…" — this only happens once per folder.
4. When it's ready, your default browser opens at `http://localhost:4200` and you see the Lemax prototype.
5. **Leave the PowerShell window open.** Closing it stops the prototype.
6. To stop the prototype, click back into the PowerShell window and press `Ctrl + C`, or just close it.

The next time you run `run.bat` for the same folder, it skips the installation steps and starts in a few seconds.

---

## 4. Iterate with Claude Code

Claude Code is the AI assistant that edits the prototype for you. You describe what you want, it changes the code, you refresh the browser, you give feedback, repeat.

### Open Claude Code in this folder

1. Open Claude Code.
2. When it asks for a working folder (or in its session menu), point it at your prototype folder, e.g. `C:\prototypes\feature-X`.
3. Confirm it loaded the right place by asking it `read CLAUDE.md` — it should respond with a summary of how the prototype is structured.

### Ask for changes

Use plain language. Keep prompts focused on *what you want the user to see or do*, not *how to code it*.

Good examples:

- *"On the Reservations grid, add a column called Margin showing the difference between Price and Net. Right-align it like the other money columns."*
- *"When clicking 'Group actions', show a small dropdown with three placeholder items: Bulk cancel, Bulk export, Send reminder."*
- *"Add a new top-level page called Reports. Show a placeholder with the Lemax page header and an empty grid that has columns: Period, Bookings, Revenue."*

### When a screen is missing

If Claude Code needs to add a screen that doesn't exist yet, give it visual guidance:

1. Take a screenshot of the Lemax screen (or sketch what you want).
2. Save it somewhere you can find — e.g. `C:\prototypes\feature-X\reference\new-screen.png`.
3. Tell Claude Code where it lives and what to do, for example:

   > *"I added a screenshot at `reference\new-screen.png`. Build a new top-level page that matches it. Add a `Loyalty` link in the topbar nav next to Options. The page goes at route `/loyalty`."*

### Iterate

1. Ask Claude Code for a change.
2. Wait for it to finish (it will tell you when the build passes).
3. **Refresh the browser tab** at `http://localhost:4200`. You usually don't need to restart `run.bat`.
4. Click around. Found something off? Take a screenshot, paste it back into Claude Code, describe what's wrong.
5. Repeat until you're happy.

### When you're stuck

- The **Reset all data** button in the top-right of the prototype's blue topbar wipes every change made *inside* the running prototype (filters, edits, copied reservations) and reloads the original demo data. It does **not** undo Claude Code edits — those are in the source files.
- If something looks broken after a Claude Code change, tell it: *"That broke X. Roll back the last change."*

---

## 5. Share the prototype with a client (Cloudflare Pages)

Once the prototype looks the way you want, you can put it on the web behind a sharable URL using **Cloudflare Pages** (free).

### 5a. Build the share-ready version

1. In your prototype folder, double-click **`build.bat`**.
2. Wait ~30 seconds. When it finishes, you'll have:
   - A folder: `dist\lemax-prototype\browser\` — this is the published website.
   - A ZIP: `prototype-share.zip` — the same folder, zipped for upload.

### 5b. Upload it the first time

1. Sign in at <https://dash.cloudflare.com/>.
2. In the left sidebar, click **Workers & Pages** (sometimes nested under **Compute** depending on the dashboard version).
3. Click the **Create** button (or **Create application**).
4. Pick the **Pages** tab, then choose **Upload assets**.
5. Give the project a name. The name becomes part of the URL, so use something like `lemax-feature-x` or `lemax-billing-prototype`. Lower-case letters, numbers and dashes only.
6. Click **Create project**.
7. When asked for files, drag-and-drop **`prototype-share.zip`** (or the contents of the `browser` folder) into the upload area.
8. Click **Deploy site**.
9. After 30–60 seconds, Cloudflare gives you a URL like `https://lemax-feature-x.pages.dev`.
10. Open that URL in a private browser window to confirm the prototype loads, then send it to your client.

> **Where Cloudflare's UI may differ:** Cloudflare occasionally renames buttons. If "Upload assets" isn't visible, look for "Direct Upload" or "Upload Direct". The flow is always: pick Pages → name the project → drop your folder/ZIP → deploy.

### 5c. Make the URL more memorable (optional)

The default `*.pages.dev` URL is fine for a client preview. If you want a custom domain like `feature-x.lemax-demos.com`, in the project's Cloudflare dashboard go to **Custom domains → Set up a custom domain** and follow the prompts. This requires that you (or someone in your org) own the domain.

---

## 6. Update an already-shared prototype

When the client comes back with feedback and you've made the changes locally:

1. Run `build.bat` again. This regenerates `prototype-share.zip` with the latest version.
2. Sign in at <https://dash.cloudflare.com/>.
3. Click **Workers & Pages** in the sidebar, then click your project (e.g. `lemax-feature-x`).
4. Click the **Create deployment** button (sometimes labelled **Upload new version** or **Direct Upload → Upload**).
5. Choose **Production** as the deployment environment.
6. Drop the new `prototype-share.zip` into the upload area.
7. Click **Deploy**. After a minute the same URL serves the new version.

The URL you sent to the client does not change. They just refresh the page.

> **Want to keep both old and new visible?** Cloudflare automatically keeps every previous deployment at its own preview URL (visible under the project's **Deployments** tab) so you can roll back or compare.

---

## 7. Troubleshooting

**The PowerShell window flashes and closes immediately.**
Right-click `run.bat` → **Run as administrator**. If that still flashes, open PowerShell manually, drag `run.bat` into it, press Enter, and read the error.

**`run.bat` says "Node.js was installed but is not visible in this terminal yet".**
Close the PowerShell window. Double-click `run.bat` again. This is expected on a brand-new Node install.

**Browser says "This site can't be reached / localhost refused to connect".**
The dev server is still compiling. Wait until you see `Compiled successfully` in the PowerShell window, then refresh.

**Browser opens to a blank or broken page.**
Hard-refresh: `Ctrl + Shift + R` in the browser. If still broken, stop `run.bat` (Ctrl+C in PowerShell), close the window, run it again.

**Claude Code edited something and now the prototype won't load.**
Tell Claude Code: *"The prototype crashes with the following error in the browser console: [paste error]. Fix it."* You can copy the error from the browser's developer tools (`F12` → Console tab).

**Cloudflare deployment fails with "build failed" or "no index.html".**
You uploaded the wrong folder. Make sure you uploaded **`prototype-share.zip`** or the contents of **`dist\lemax-prototype\browser\`** — not the whole project folder.

**I want to throw everything away and start clean.**
Delete the prototype folder. Re-download the ZIP from the GitHub link in step 2. Extract again. Run `run.bat`. You'll lose any Claude Code edits — back them up first if you want them.

---

## What's where (cheat sheet)

| Item | Where |
| --- | --- |
| Start the prototype locally | Double-click `run.bat` |
| Build the share-ready version | Double-click `build.bat` |
| Files to upload to Cloudflare | `prototype-share.zip` (or `dist\lemax-prototype\browser\`) |
| Reset prototype data while it's running | "Reset all data" button in the topbar |
| Guide for AI assistants editing the code | `CLAUDE.md` |
