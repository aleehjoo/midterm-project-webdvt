# Ledger — Personal Budget Tracker

A multi-page budget tracker built with React. Log income and expenses, file them
under categories, filter and search the ledger, see where the money went, and
switch the whole app between light and dark.

The interface follows Apple's Human Interface Guidelines: inset grouped lists,
large titles that hand off to a translucent nav bar, segmented controls, action
sheets, and the iOS system colour palette — tinted systemIndigo.

**Live:** https://midterm-project-webdvt-ios.vercel.app
**Repository:** https://github.com/aleehjoo/midterm-project-webdvt

---

## Pages

Each is a real route with its own URL, not a conditionally rendered section.

| Route              | Screen              | What it does                                                                                                      |
| ------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `/`                | Dashboard           | Current balance (income − expenses), the full transaction list, filtering by type and category, and search. Every row links to its own detail page. |
| `/add`             | Add Transaction     | Validated form for logging an entry. Returns to the dashboard on success.                                          |
| `/transaction/:id` | Transaction Detail  | Full details of one transaction. Edit in place, or delete behind a confirmation sheet.                             |
| `/summary`         | Summary             | Spending broken down by category as a ring chart and ranked bars, plus the app-wide theme toggle and contact links. |
| `*`                | Not Found           | Anything else.                                                                                                     |

## Required React concepts

### 1. React Router

Four distinct URLs, declared in [`src/App.jsx`](src/App.jsx). They share one
persistent shell — [`src/components/Layout.jsx`](src/components/Layout.jsx) — via
a layout route, so the nav bar and tab bar survive navigation. The detail page
reads its id with `useParams`, and both providers sit above `BrowserRouter` so
neither the theme nor the transaction list resets when the route changes.

### 2. Context API

The theme lives in [`src/context/ThemeContext.js`](src/context/ThemeContext.js)
and [`src/context/ThemeProvider.jsx`](src/context/ThemeProvider.jsx). The toggle
is on the Summary screen, but the value is consumed at the root — no `theme` prop
is passed through any component in between.

The provider applies the choice by toggling a single `dark` class on `<html>`.
Because every screen is styled from the same CSS custom properties, that one
class flip re-themes routes that are not even mounted. The choice is persisted,
falls back to the operating system setting on a first visit, and is re-applied by
an inline script in [`index.html`](index.html) before first paint so a dark-mode
reload never flashes white.

A second context, [`TransactionsContext`](src/context/TransactionsContext.js),
shares one instance of the custom hook below so all four screens read and write
the same list.

### 3. Custom hook

[`src/hooks/useTransactions.js`](src/hooks/useTransactions.js) is the transaction
store: `addTransaction`, `updateTransaction`, `removeTransaction`,
`clearTransactions`, `getTransaction`, plus derived `totals` and
`spendingByCategory`.

It is composed over a lower-level primitive,
[`src/hooks/useLocalStorage.js`](src/hooks/useLocalStorage.js), which is `useState`
that survives reloads — it knows about storage and nothing about budgets, and is
reused by the theme provider for exactly that reason.

Nothing else in the app touches `localStorage` directly, so the persistence
format is defined in one place. The hook is independent of React Router and of
any particular screen; calling it directly in a component gives that component
its own synced copy, which is what makes it genuinely reusable rather than a
singleton in disguise.

A third hook, [`useScrolled`](src/hooks/useScrolled.js), drives the nav bar's
transition from transparent to blurred.

### 4. Performance optimization

**The problem.** The dashboard re-renders on every keystroke in the search field
and on every filter change. Each of those renders would rebuild every row in the
list — a category lookup, currency formatting, date formatting, and a fresh
`<Link>` per row — and throw the result away immediately.

**The fix**, in two halves that only work together:

- [`src/components/TransactionRow.jsx`](src/components/TransactionRow.jsx) is
  wrapped in `React.memo`. `useTransactions` only ever replaces transaction
  objects, never mutates them in place, so a row's props stay reference-equal
  unless that specific transaction actually changed.
- [`src/pages/Dashboard.jsx`](src/pages/Dashboard.jsx) wraps the filtered list in
  `useMemo`, keeping the array identity stable so the memo above is not
  invalidated on every render.

The result: typing in the search box re-renders only the rows entering or leaving
the results, instead of all of them.

Supporting work in the same vein — the context values in
[`ThemeProvider`](src/context/ThemeProvider.jsx) and
[`useTransactions`](src/hooks/useTransactions.js) are memoised so consumers do
not re-render on an unrelated parent render, and the shared form subscribes to
individual fields with `useWatch` so typing an amount does not re-render the
category grid.

---

## Tech stack

- **React 19** + **Vite**
- **React Router 7** — routing
- **Tailwind CSS v4** — CSS-first `@theme` tokens, no config file
- **React Hook Form** + **Yup** — form state and validation
- **React Icons** (Ionicons) — the iOS icon set
- **Moment.js** — date formatting
- **vite-plugin-pwa** — installable, offline-capable, custom app icons
- **ESLint**

## Running it

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Project structure

```
src/
├── App.jsx                     routes and providers
├── components/                 UI primitives and the app shell
│   ├── ActionSheet.jsx         iOS confirmation sheet
│   ├── AppBar.jsx              translucent top bar, desktop nav
│   ├── TabBar.jsx              iOS bottom tab bar (phones)
│   ├── InsetGroup.jsx          inset grouped list card and rows
│   ├── SegmentedControl.jsx    sliding-thumb segmented control
│   ├── Switch.jsx              iOS toggle
│   ├── DonutChart.jsx          proportional ring chart
│   ├── TransactionForm.jsx     shared add/edit form
│   └── TransactionRow.jsx      memoised list row
├── context/                    theme and transaction stores
├── hooks/                      useLocalStorage, useTransactions, useScrolled
├── data/                       categories, navigation, first-run sample data
├── pages/                      the four screens plus Not Found
├── utils/format.js             currency, dates, percentages
└── index.css                   design tokens, light and dark palettes
```

## Notes

- **Currency** is set by two constants at the top of
  [`src/utils/format.js`](src/utils/format.js) (`CURRENCY` and `LOCALE`, currently
  PHP / `en-PH`). Every amount in the app is formatted through that module, so
  changing those two lines moves the whole app to another currency.
- **Sample data** is seeded on a first visit only, so the dashboard and summary
  have something to show. It is generated relative to today's date, and is
  replaced by real storage as soon as anything is added, edited, or deleted.
  *Erase All Transactions* on the Summary screen clears everything.
- **Storage is per-browser.** There is no backend; transactions live in
  `localStorage` on the device that entered them.
- **Motion** respects `prefers-reduced-motion`. Entrance animations are gated
  behind `motion-safe` rather than merely shortened, because they begin at zero
  opacity.
