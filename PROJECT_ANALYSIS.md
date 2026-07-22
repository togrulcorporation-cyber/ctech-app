# CTECH Service Platform — Project Analysis

> **Purpose:** Reference document for splitting `index.html` into a clean multi-file structure.  
> **Created:** 2026-07-22  
> **Status:** Read-only analysis — no refactor applied yet.

---

## 1. Project overview

| Item | Detail |
|------|--------|
| **Name** | CTECH Technical Service Platform |
| **Type** | Static single-page application (SPA-style), Progressive Web App (PWA) |
| **Language (UI)** | Azerbaijani |
| **Backend** | Google Apps Script web app (`API_URL` in JS) |
| **Build tooling** | None — no npm, bundler, or framework |
| **Total size** | `index.html` ≈ **4,445 lines** |

### Repository files (current)

```
ctech-app/
├── index.html          ← entire app (HTML + CSS + JS)
├── manifest.json       ← PWA manifest (start_url: ./index.html)
├── service-worker.js   ← minimal pass-through fetch SW
└── README.md           ← placeholder ("# ctech-app")
```

### Referenced assets (not all present in repo listing)

- `favicon.png`, `apple-touch-icon.png`
- `icon-192.png`, `icon-512.png` (manifest)
- `banner.webp` (dashboard banner)

### External dependencies (CDN)

- **Google Fonts:** Rajdhani, Inter, IBM Plex Mono
- **SheetJS (XLSX):** `xlsx.full.min.js` v0.18.5 — Excel export for report & dashboard

---

## 2. Architecture at a glance

The app is a **view-switching monolith**: one HTML document, one global `<script>` block, visibility toggled via `element.style.display`.

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                           │
├──────────────┬──────────────────────┬───────────────────────┤
│   <head>     │      <body>          │   <script> (global)   │
│   meta/PWA   │   all view DOM       │   all app logic       │
│   fonts/CDN  │   overlays/modals    │   onclick handlers    │
│   ~1,456 CSS │   ~854 HTML          │   ~2,102 JS           │
└──────────────┴──────────────────────┴───────────────────────┘
                              │
                              ▼
              Google Apps Script API (POST JSON)
```

### PWA / offline

- `manifest.json` → standalone, portrait, theme `#2F6FED`
- `service-worker.js` → install/activate + network-only fetch (no cache strategy)
- SW registered on load: `navigator.serviceWorker.register("service-worker.js")`

---

## 3. File anatomy — `index.html` line map

| Lines (approx.) | Section | Size |
|-----------------|---------|------|
| 1–25 | `<head>` meta, PWA links, viewport fix, CDN scripts/fonts | ~25 |
| 26–1482 | `<style>` — all CSS | ~1,456 |
| 1485–2339 | `<body>` — all HTML views & overlays | ~854 |
| 2340–4442 | `<script>` — all JavaScript | ~2,102 |

---

## 4. CSS sections (inside `<style>`)

CSS is organized with comment headers. These are natural split boundaries:

| Comment header | Lines (approx.) | Scope |
|----------------|-----------------|-------|
| `/* ===== LOGIN ===== */` | 32–62 | Login screen |
| `/* ===== DASHBOARD ===== */` | 63–152 | Main hub, header, menu, modals, loading |
| `/* ===== BUS SERVICE VIEW ===== */` | 153–568 | Bus service form, dropdowns, confirm dialogs |
| `/* ===== DARK MODE ===== */` | 569–637 | `body.dark-mode` overrides (cross-cutting) |
| `/* ===== BUS REPORT VIEW ===== */` | 639–933 | Real-time report table & toolbar |
| `/* ===== BUS DASHBOARD ===== */` | 934–1123 | Analytics dashboard, modal, calendar |
| `/* ===== BUS DETAIL VIEW ===== */` | 1124–1182 | Ticket read-only detail |
| `/* ===== BUS BULK SERVICE VIEW ===== */` | 1183–1480 | Bulk import UI |

**Notes for split:**

- Dark mode rules reference selectors from every module → keep as `dark-mode.css` loaded last, or duplicate carefully.
- Some inline `style="..."` on HTML elements (especially bulk view & ticket badge) bypass CSS files — must stay in HTML or be migrated to classes.
- Shared utilities in CSS: `.spinner`, `@keyframes spin`, `@keyframes popIn`, `.icon-btn`, `.bs-home-btn`.

---

## 5. HTML views & overlays

### Primary views (full-screen or main content)

| Element ID | Lines (approx.) | Role | Default display |
|------------|-----------------|------|-----------------|
| `#loginView` | 1488–1522 | Email/password login | visible (`flex`) |
| `#dashboardView` | 1525–1650 | Home hub after login | `none` |
| `#busServiceView` | 1885–2109 | Create/edit bus service ticket | `none` |
| `#busReportView` | 1661–1723 | Real-time report list | `none` |
| `#busDetailView` | 1726–1740 | Ticket detail (read-only) | `none` |
| `#busDashboardView` | 1743–1840 | Statistics dashboard | hidden via CSS (no inline display) |
| `#busBulkView` | 2191–2329 | Bulk ticket import | hidden via CSS |

### Overlays / modals (shared or module-specific)

| Element ID | Purpose |
|------------|---------|
| `#loadingOverlay` | Login loading success/fail |
| `#aboutModal` | About platform modal |
| `#busOpenOverlay` | “BUS Service loading…” splash |
| `#bsConfirmOverlay` | Unsaved form exit confirm |
| `#bsDraftConfirmOverlay` | Restore draft confirm |
| `#bsRefreshConfirmOverlay` | Pull-to-refresh unsaved warn |
| `#bsLoadingOverlay` | Bus service submit loading |
| `#dashLoading` | Dashboard data loading |
| `#dashModal` | Date range + filter modal |
| `#bkLoadingOverlay` | Bulk import loading |

### Dashboard sub-sections (inside `#dashboardView`)

- `#dashboardsSection` — hidden for `technician` role
- `#reportsSection` — always shown
- `#adminMenuItem` — shown only for `admin` role

---

## 6. JavaScript modules (logical — currently one `<script>`)

All functions are **global** (`function name(){}` / `var`). HTML uses **`onclick="..."`**, **`oninput="..."`**, **`onchange="..."`** extensively → any split must preserve global names or update all HTML bindings.

### 6.1 Config & bootstrap (lines ~2342–2434)

| Symbol | Purpose |
|--------|---------|
| `API_URL` | Google Apps Script endpoint |
| `currentUser` | Logged-in user object from API |
| `SESSION_KEY`, `SESSION_DAYS` | localStorage session (`ctech_session`, 14 days) |
| `saveSession`, `clearSession`, `loadSession` | Session persistence |
| `clockStarted` | One-time clock init flag |

**Startup sequence:**

1. Register service worker
2. `loadSession()` → if valid, `showDashboard()`
3. Restore theme from `localStorage` key `ctech_theme`

### 6.2 Authentication & shell (lines ~2353–2434)

| Function | Purpose |
|----------|---------|
| `togglePassword` | Show/hide password |
| `showLoading`, `showLoadingSuccess`, `showLoadingFail` | Login overlay states |
| `login` | POST `checkUser` |
| `showDashboard` | Show hub, set profile, start clock |
| `getAccessLevel(role)` | Returns `admin` \| `leader` \| `technician` |
| `applyAccessLevel` | Show/hide dashboard sections & admin menu |
| `updateClock` | Baku timezone clock (`#clockDate`, `#clock`) |
| `goHome`, `toggleMenu`, `closeMenu`, `signOut` | Navigation |
| `showAbout`, `hideAbout`, `moduleAlert` | About modal & “coming soon” alerts |
| `applyTheme`, `toggleTheme` | Dark mode + icon sync (`themeIcon`, `rptThemeIcon`, `dashThemeIcon`, `bkThemeIcon`) |

### 6.3 Bus Service form (lines ~2440–3298)

**State variables:**

| Variable | Purpose |
|----------|---------|
| `bsFormData` | Cached API form lists (carriers, problems, registry, etc.) |
| `bsFormDirty` | Unsaved changes flag |
| `bsNextTicketId` | Next ticket ID from API |
| `bsRegistryLocked` | D.Q.N. registry match locked fields (**declared twice**: ~2443 and ~3033) |
| `bsSelected` | Dropdown selections object |
| `activeDDKey` | Currently open inline dropdown |
| `ddMeta` | Dropdown config (label id, list id, multi, callbacks) |
| `bsEditMode`, `bsEditTicketId`, `bsReturnTarget` | Edit flow (`dashboard` or `report`) |

**Major function groups:**

- **Inline dropdowns:** `toggleDD`, `closeDD`, `closeAllDD`, `renderDD`, `getListForKey`, `selectDDItem`, `updateMultiLabel`, `setDDValue`, `fillAllDDs`
- **Time inputs:** `formatTimeInput`, `getTimeInputValue`, `setTimeInputValue`, `getTimeValue`
- **Navigation/open:** `startBusService`, `preloadBusData`, `openBusService`, `openBusServiceForEdit`, `resetBusFormFields`
- **Submit:** `submitBusService` → `submitBusService` or `updateBusService`
- **Exit flow:** `attemptBusHome`, `closeConfirm`, `confirmExit`, `bsGoBack`
- **D.Q.N. registry search:** `normalizeDqn`, `filterBusRegistry`, `renderBusRegistryDropdown`, `selectBusRegistryMatch`, `lockRegistryFields`, `unlockRegistryFields`, `resetRegistrySelection`
- **Draft autosave:** `saveBsDraft`, `scheduleBsDraftSave`, `clearBsDraft`, `loadBsDraft`, `restoreBsDraft` — key `ctech_bs_draft`
- **Draft restore UI:** `offerBsDraftRestore`, `acceptBsDraft`, `declineBsDraft`

**DOMContentLoaded listeners:** plate input formatting, bus ID numeric filter, route uppercase, dirty tracking, Enter→Tab in bus form.

**Access control:** `#bsBulkBannerWrap` visible only for `leader` and `admin`.

### 6.4 Bus Real-Time Report (lines ~3301–3520)

| Variable | Purpose |
|----------|---------|
| `rptAllRows`, `rptColumns`, `rptFiltered` | Report data |
| `rptShownCount`, `rptPageSize` | Pagination (20 per page) |
| `rptAutoRefresh` | 120s interval refresh |
| `RPT_SEARCH_FIELDS` | Global search columns |

| Function | Purpose |
|----------|---------|
| `openBusReport`, `closeBusReport` | View navigation |
| `loadReportData` | POST `getReportData` |
| `applyFilters`, `renderTable`, `rptShowMore` | Search & table |
| `canEditTicket` | Edit permission by role/creator |
| `openBusDetail`, `closeBusDetail` | Detail sub-view |
| `exportToExcel` | XLSX export of filtered rows |
| `DV_FIELD_MAP` | Detail view field layout |

### 6.5 Bus Dashboard (lines ~3522–4078)

| Variable | Purpose |
|----------|---------|
| `dashAllRows` | All report rows for analytics |
| `dashPeriod` | `24h` \| `week` \| `month` \| `all` |
| `dashCustomRange` | Custom date range from modal |
| `dashActiveChips`, `dashSubfilterState`, `dashTextFilters` | Filter UI state |
| `DASH_CATS` | Filter category definitions |
| `dcalYear`, `dcalMonth`, `dcalRangeStart`, `dcalRangeEnd` | Dashboard calendar |

| Function | Purpose |
|----------|---------|
| `openBusDashboard`, `closeBusDashboard`, `loadDashData` | Navigation & data load |
| `dashComputeAndRender` | Main render orchestrator |
| `dashGetFilteredRows`, `dashCount*`, `dashFixedMetrics` | Aggregations |
| `dashRenderRadial`, `dashRenderRankList`, `dashRenderTiles`, `dashRenderLeaders`, `dashRenderRecurring`, `dashRenderMobile` | UI renderers |
| `openDashModal`, `closeDashModal`, `buildDashChips`, `renderDashSubfilters`, `runDashSearch`, `renderDashModalResults` | Filter modal |
| `initDcal`, `renderDcal`, `pickDcalDate`, `dcalNav` | Calendar widget |
| `exportDashboardExcel` | Multi-sheet XLSX export |

**Shared helpers used here:** `escapeHtml`, `getBakuNowParts`, `bakuNowDate`, `daysInCurrentMonth`, `rowDate`, `buildRankTableRows`

### 6.6 Pull-to-refresh & lifecycle (lines ~4157–4201)

- Touch handlers on `document` — reload when pull down at scroll top
- `isUnsavedWorkPresent()` checks `bsFormDirty` + visible `#busServiceView`
- `beforeunload` warning when unsaved bus form

### 6.7 Bus Bulk Import (lines ~4203–4440)

| Variable | Purpose |
|----------|---------|
| `bkCalYear`, `bkCalMonth`, `bkSelectedDate` | Date picker state |
| `bkPreviewData` | Preview API response |
| `bkFormDataLoaded` | Form data ready flag |

| Function | Purpose |
|----------|---------|
| `openBusBulk`, `closeBusBulk` | View switch (from bus service) |
| `ensureBulkFormData`, `bkFillSelects`, `bkFillSel` | Populate `<select>` elements |
| `bkOnCarrierChange` | Count buses per carrier |
| `bkCollectData`, `bkValidate` | Form payload |
| `bkOpenPreview`, `renderBkPreviewPanel`, `bkConfirmImport`, `bkSubmitDirect`, `bkRunImport` | Preview & submit |
| `resetBulkForm` | Clear form after success |

---

## 7. API contract (Google Apps Script)

All requests: `POST` to `API_URL`, header `Content-Type: text/plain;charset=utf-8`, body `JSON.stringify({ action, ... })`.

| Action | Used by | Notes |
|--------|---------|-------|
| `checkUser` | Login | `{ email, password }` → `{ status: "OK" \| "WRONG_PASSWORD" \| ..., name, role, email }` |
| `getFormData` | Bus form, dashboard filters, bulk | Returns carriers, problems, solutions, locations, technicians, leaders, busRegistry, nextTicketId, etc. |
| `submitBusService` | New ticket | `{ data, userEmail }` |
| `updateBusService` | Edit ticket | `{ ticketId, data, userEmail }` |
| `getServiceById` | Edit mode preload | `{ ticketId }` |
| `getReportData` | Report & dashboard | `{ rows[], columns[] }` |
| `previewBulkImport` | Bulk preview | `{ data }` → count + sample |
| `submitBulkImport` | Bulk submit | `{ data, userEmail }` |

---

## 8. Navigation & view state machine

There is **no central router**. Each feature manually sets `display` on relevant elements.

### Typical flows

```
loginView ──login──► dashboardView
dashboardView ──startBusService──► busOpenOverlay ──► busServiceView
dashboardView ──openBusReport──► busReportView
dashboardView ──openBusDashboard──► busDashboardView
busServiceView ──openBusBulk──► busBulkView
busReportView ──openBusDetail──► busDetailView
busReportView ──openBusServiceForEdit──► busServiceView (bsReturnTarget="report")
```

### Functions that hide/show views

| Function | Shows | Hides (partial list) |
|----------|-------|----------------------|
| `showDashboard` | `dashboardView` | `loginView`, `busServiceView` |
| `goHome` | `dashboardView` | `loginView`, `busServiceView` |
| `signOut` | `loginView` | `dashboardView`, `busServiceView` |
| `openBusService` | `busServiceView` | `dashboardView`, `busReportView` |
| `bsGoBack` | `dashboardView` or `busReportView` | `busServiceView` |
| `openBusReport` | `busReportView` | `dashboardView` |
| `openBusDashboard` | `busDashboardView` | `dashboardView` |
| `openBusBulk` | `busBulkView` | `busServiceView` |

### ⚠️ Split / refactor risk: incomplete navigation

`goHome()` and `showDashboard()` do **not** hide:

- `#busReportView`
- `#busDashboardView`
- `#busDetailView`
- `#busBulkView`

If user opens menu → “Ana səhifə” while in report/dashboard, those views may remain visible underneath. **Preserve or fix intentionally when splitting.**

---

## 9. LocalStorage keys

| Key | Content |
|-----|---------|
| `ctech_session` | `{ user, expires }` — 14-day session |
| `ctech_theme` | `"dark"` \| `"light"` |
| `ctech_bs_draft` | Serialized bus form draft |

---

## 10. Role-based access

`getAccessLevel(role)` logic:

| Role match (case-insensitive) | Level | UI effect |
|-------------------------------|-------|-----------|
| contains `admin` | `admin` | Admin menu item, bulk import, excel export, dashboards |
| contains `team`, `leader`, or `rəhbər` | `leader` | Dashboards, bulk import, excel export |
| else | `technician` | No dashboards section; report excel hidden; can edit own tickets only |

---

## 11. Inline event handlers (split caution)

Heavy use of HTML attributes — **must remain global** unless migrated to `addEventListener`:

Examples: `onclick="login()"`, `onclick="toggleDD('carrier')"`, `oninput="formatTimeInput(this)"`, `oninput="applyFilters()"`, `onclick="exportToExcel()"`, etc.

**Count:** 50+ inline handlers across views.

---

## 12. Shared cross-module dependencies

When splitting JS, load order matters:

```
config (API_URL)
  → utils (escapeHtml, bakuNowDate, getBakuNowParts, rowDate)
  → auth (currentUser, session, getAccessLevel)
  → shell (theme, clock, menu)
  → bus-service (bsFormData — shared with dashboard & bulk)
  → bus-report
  → bus-dashboard (depends on bsFormData, getAccessLevel, escapeHtml, rowDate)
  → bus-bulk (depends on bsFormData, currentUser, escapeHtml, bakuNowDate)
  → init (SW register, session restore, theme restore, DOMContentLoaded blocks)
```

`bsFormData` is a **shared cache** across Bus Service, Dashboard filters, and Bulk Import.

---

## 13. Proposed target structure (for future split)

Goal: **clear structure, zero behavior change**, works as static files (no server required).

```
ctech-app/
├── index.html                 # Shell: head links + view includes or single body
├── manifest.json
├── service-worker.js
├── README.md
├── PROJECT_ANALYSIS.md        # This file
│
├── assets/
│   ├── banner.webp
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   └── icon-512.png
│
├── css/
│   ├── 00-base.css            # reset, body, spinners, shared components
│   ├── 01-login.css
│   ├── 02-dashboard.css
│   ├── 03-bus-service.css
│   ├── 04-bus-report.css
│   ├── 05-bus-detail.css
│   ├── 06-bus-dashboard.css
│   ├── 07-bus-bulk.css
│   └── 99-dark-mode.css       # load last
│
├── js/
│   ├── 00-config.js           # API_URL, constants
│   ├── 01-utils.js            # escapeHtml, dates, rowDate
│   ├── 02-auth.js             # session, login, getAccessLevel
│   ├── 03-shell.js            # theme, clock, menu, goHome, moduleAlert
│   ├── 04-bus-service.js      # form, dropdowns, registry, draft, submit
│   ├── 05-bus-report.js       # report, detail, exportToExcel
│   ├── 06-bus-dashboard.js    # dashboard, modal, calendar, exportDashboardExcel
│   ├── 07-bus-bulk.js         # bulk import
│   ├── 08-pull-refresh.js     # PTR + beforeunload
│   └── 99-bootstrap.js        # SW, session restore, theme restore
│
└── views/                     # OPTIONAL — see note below
    ├── login.html
    ├── dashboard.html
    ├── bus-service.html
    ├── bus-report.html
    ├── bus-detail.html
    ├── bus-dashboard.html
    ├── bus-bulk.html
    └── partials/
        ├── overlays.html
        └── modals.html
```

### HTML split options

| Approach | Pros | Cons |
|----------|------|------|
| **A. Keep one `index.html` body** | Safest; no fetch/build; works on `file://` | HTML still large |
| **B. `<script type="module">` + imports** | Modern | Must refactor globals & all `onclick` |
| **C. Build step (concat)** | Clean output | Adds tooling |
| **D. Runtime `fetch()` partials** | No build | Breaks offline/`file://`; needs SW cache |

**Recommendation:** Split **CSS + JS first** (linked files, classic script order). Keep HTML in `index.html` initially, optionally extract to `views/*.html` only if a small build script is acceptable.

### Target `index.html` shell (sketch)

```html
<!DOCTYPE html>
<html>
<head>
  <!-- meta, manifest, fonts, xlsx CDN -->
  <link rel="stylesheet" href="css/00-base.css">
  <!-- ... other css in order ... -->
  <link rel="stylesheet" href="css/99-dark-mode.css">
</head>
<body>
  <!-- all views (unchanged IDs) -->

  <script src="js/00-config.js"></script>
  <script src="js/01-utils.js"></script>
  <!-- ... ordered scripts ... -->
  <script src="js/99-bootstrap.js"></script>
</body>
</html>
```

---

## 14. Split checklist (when implementing)

- [ ] Preserve every `id` attribute exactly (JS depends on them)
- [ ] Preserve global function names used in `onclick` / `oninput`
- [ ] Keep script load order per section 12
- [ ] Load `99-dark-mode.css` after all other CSS
- [ ] Keep `manifest.json` `start_url` pointing to entry HTML
- [ ] Update `service-worker.js` cache list if adding cached assets (optional)
- [ ] Test login → dashboard → each module → back navigation
- [ ] Test dark mode on all views (4 theme icon IDs)
- [ ] Test draft restore, unsaved exit, pull-to-refresh
- [ ] Test Excel export (report + dashboard) after XLSX CDN load
- [ ] Test PWA install + SW registration paths relative to new folders
- [ ] Verify role-based visibility (technician vs leader vs admin)

---

## 15. Known quirks (do not “fix” accidentally during split)

1. **`var bsRegistryLocked` declared twice** (~2443, ~3033) — harmless in sloppy global mode; consolidating is safe but optional.
2. **`goHome()` incomplete view hiding** — see section 8.
3. **`#busDashboardView` / `#busBulkView`** use CSS default hidden, not inline `display:none`.
4. **Inline styles** on ticket badge, bulk header buttons, calendar — tied to dark-mode overrides using attribute selectors like `span[style*="Rajdhani"]`.
5. **`ddMeta.system`** exists in JS but no matching dropdown in current HTML (legacy/unused?).
6. **TVM modules** show `moduleAlert("... tezliklə hazır olacaq")` — placeholders only.

---

## 16. Testing matrix (post-split)

| Scenario | Expected |
|----------|----------|
| Fresh visit | Login screen |
| Remember me + reload | Auto dashboard |
| Dark theme + reload | Theme persists |
| Bus service new ticket | Draft saves; submit creates ticket |
| Bus service edit from report | Returns to report after save |
| Report search + load more | Filters work |
| Report Excel | Downloads `.xlsx` (non-technician) |
| Dashboard period tabs | Metrics update |
| Dashboard custom filter modal | Calendar + chips |
| Bulk import preview + submit | Leader/admin only |
| Pull down refresh on bus form | Confirm if dirty |
| Sign out | Clears session, shows login |

---

## 17. Summary

`index.html` is a **complete static PWA** for CTECH field technicians: login, bus service ticketing, real-time reports, analytics dashboard, and bulk import — all talking to one Google Apps Script backend. The code is intentionally **framework-free** with **global functions** and **inline handlers**.

The safest refactor path is:

1. Extract CSS into ordered stylesheets  
2. Extract JS into ordered classic scripts (not ES modules initially)  
3. Leave HTML structure intact (same IDs)  
4. Optionally extract HTML later with a build step  

This document should be treated as the **source of truth** when performing the split.
