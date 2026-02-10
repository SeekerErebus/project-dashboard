# FlowDesk (Demo)

> **This is a frozen portfolio demo.** It is not actively maintained. The live FlowDesk product is in active development in a separate repository.

A project management dashboard built for freelancers and AI-agent-driven workflows. Track projects, tasks, clients, revenue, and deadlines from a single dark-themed command center.

![FlowDesk Dashboard Screenshot](https://via.placeholder.com/1200x630/020617/6366f1?text=FlowDesk+Dashboard)

<!-- Replace the placeholder above with an actual screenshot -->

## Features

- **Kanban Project Board** -- Drag-free column view with Lead, In Progress, Review, and Completed stages. Each card shows client, progress bar, budget, priority, and due date.
- **Task Management** -- Full task list with inline creation, checkbox completion, and multi-axis filtering (project, priority, status). Dynamically add tasks without page reload.
- **Client Directory** -- Card grid of all clients with status badges, revenue totals, and active project counts. Detail pages show contact info, associated projects, budget breakdowns, and notes.
- **Project Detail Pages** -- Per-project view with circular progress indicator, scope checklist, budget tracker with spend percentage, timeline with days-remaining calculations, and linked tasks.
- **Client Detail Pages** -- Per-client view with contact info, project list with progress bars, revenue summary, task stats, and quick-action links (email, call).
- **Interactive Calendar** -- Month-view calendar rendered client-side with task and project deadlines color-coded by project. Navigate between months or jump to today.
- **Revenue Dashboard** -- Chart.js bar chart showing monthly revenue vs. expenses, plus stat cards for active projects, revenue this month, pending invoices, and tasks due this week.
- **Activity Feed** -- Timeline-style feed of recent events (task completions, payments, comments, milestones, new leads) with color-coded icons and relative timestamps.
- **Upcoming Deadlines** -- Sorted deadline list with overdue/urgent/normal badges and project color indicators.
- **Keyboard Shortcuts** -- `Cmd/Ctrl+K` for search, `G then D/T/P/C` for page navigation, `N` to create a task, arrow keys to navigate task list, `?` for shortcuts modal.
- **Dark/Light Theme** -- Toggle between dark and light mode with localStorage persistence and flash-of-wrong-theme prevention.
- **Responsive Design** -- Sidebar navigation on desktop, bottom tab bar on mobile. Mobile hamburger menu with overlay. All layouts adapt from phone to widescreen.
- **Global Search** -- Search bar in the top header with keyboard shortcut focus.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro 5.x](https://astro.build) (static output) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite` |
| Charts | [Chart.js 4](https://www.chartjs.org) |
| Interactivity | Vanilla client-side JavaScript (no framework runtime) |
| Font | [Inter](https://rsms.me/inter/) via Google Fonts |
| Icons | Inline SVG (Heroicons style) |

Zero-dependency client runtime. All interactivity is vanilla JS with no React, Vue, or other framework overhead shipped to the browser.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/SeekerErebus/flowdesk-demo.git
cd flowdesk-demo

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

The static output lands in `./dist/` and can be deployed to any static host.

## Project Structure

```
src/
  data/
    activity.json     # Activity feed events
    clients.json      # Client records (Acme Corp, Meridian, Pinnacle Labs, etc.)
    projects.json     # Project records with budgets, scope, and progress
    revenue.json      # Monthly revenue/expense data and summary stats
    tasks.json        # Task records with status, priority, and due dates
  layouts/
    DashboardLayout.astro   # Shared shell: sidebar, top bar, mobile nav, shortcuts modal
  pages/
    index.astro             # Dashboard home (stats, chart, activity, deadlines)
    calendar/index.astro    # Interactive month-view calendar
    clients/index.astro     # Client directory grid
    clients/[id].astro      # Client detail page
    projects/index.astro    # Kanban project board
    projects/[id].astro     # Project detail page
    tasks/index.astro       # Task list with filters and inline creation
  styles/
    global.css              # Tailwind 4 theme, custom surface/accent palette, utilities
```

## Demo Data

This demo ships with fictional seed data for portfolio/showcase purposes:

- **4 clients** -- Acme Corp, Meridian Consulting, Pinnacle Labs, The Wild Sage
- **4 projects** -- E-Commerce Redesign, Brand Identity & Website, API Integration Dashboard, Restaurant Website
- **Multiple tasks** per project with varying statuses and priorities
- **Revenue data** with monthly breakdowns and YTD summary

All data lives in `src/data/*.json` and can be swapped out for real records.

## Live Demo

<!-- Replace with actual deployed URL -->
[View Live Demo](#)

## License

MIT

---

Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).
