* {
  box-sizing: border-box;
}

:root {
  --bg: #090a0d;
  --panel: rgba(20, 23, 28, 0.82);
  --panel-strong: rgba(17, 18, 20, 0.94);
  --panel-soft: rgba(36, 40, 45, 0.75);
  --line: rgba(255, 255, 255, 0.08);
  --text: #f3f3f3;
  --muted: #afb6be;
  --accent: #c62d2d;
  --accent-strong: #ff4b4b;
  --accent-soft: rgba(198, 45, 45, 0.18);
  --success: #75d390;
  --warning: #f0c76b;
  --danger: #ff5b5b;
  --shadow: rgba(0, 0, 0, 0.5);
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
}

body {
  background:
    linear-gradient(180deg, rgba(7, 8, 12, 0.82), rgba(7, 8, 12, 0.82)),
    url('assets/peaky-bg.svg') center/cover no-repeat fixed;
}

button {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 640px;
  margin: 0 auto;
  padding: 1rem 0.85rem 6.2rem;
}

.glass {
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
}

.card {
  border-radius: 18px;
  padding: 1rem;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0 1rem;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.brand-mark {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(140deg, var(--accent), #5b1212);
  color: #fff;
  font-weight: 800;
  font-size: 1.3rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.brand-name {
  font-weight: 800;
  letter-spacing: 0.12rem;
  font-size: 0.9rem;
}

.brand-sub {
  color: var(--muted);
  font-size: 0.65rem;
  letter-spacing: 0.28rem;
}

.main-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.screen {
  display: none;
  gap: 1rem;
  flex-direction: column;
}

.screen.active {
  display: flex;
}

.hero {
  background: linear-gradient(180deg, rgba(22,20,22,0.9), rgba(17,18,20,0.74));
}

.eyebrow,
.tiny-label {
  margin: 0;
  color: var(--muted);
  letter-spacing: 0.18rem;
  text-transform: uppercase;
  font-size: 0.7rem;
}

.hero h1,
.section-head h2 {
  margin: 0.35rem 0 0.4rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  letter-spacing: 0.08rem;
}

.tagline {
  margin: 0;
  color: var(--muted);
  font-weight: 600;
  letter-spacing: 0.08rem;
}

.hero-meta {
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
}

.meta-label {
  display: block;
  color: var(--muted);
  font-size: 0.68rem;
  margin-bottom: 0.3rem;
}

.hero-meta strong {
  display: block;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-height: 94px;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.12rem;
  text-transform: uppercase;
}

.stat-card strong {
  font-size: 1.7rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
}

.card-header.split {
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 91, 91, 0.15);
  color: var(--danger);
  border: 1px solid rgba(255, 91, 91, 0.25);
  padding: 0.35rem 0.7rem;
  font-size: 0.68rem;
  letter-spacing: 0.12rem;
  text-transform: uppercase;
}

.status-badge.success {
  background: rgba(117, 211, 144, 0.12);
  border-color: rgba(117, 211, 144, 0.25);
  color: var(--success);
}

.quote-card p {
  margin: 0;
  font-size: 1.06rem;
  line-height: 1.6;
  color: #ececec;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.9rem;
  background: var(--panel-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.task-item.done {
  border-color: rgba(117, 211, 144, 0.35);
  background: rgba(117, 211, 144, 0.08);
}

.task-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.task-main input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: var(--accent);
  cursor: pointer;
}

.task-copy {
  flex: 1;
  min-width: 0;
}

.task-subject {
  display: block;
  color: var(--muted);
  font-size: 0.68rem;
  margin-bottom: 0.28rem;
  letter-spacing: 0.12rem;
  text-transform: uppercase;
}

.task-title {
  display: block;
  font-weight: 700;
  line-height: 1.35;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--muted);
  font-size: 0.72rem;
  margin-top: 0.25rem;
}

.task-points {
  color: var(--warning);
  font-weight: 700;
  white-space: nowrap;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.subject-progress-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subject-card {
  border-radius: 18px;
  padding: 0.9rem;
  background: rgba(20, 23, 28, 0.8);
  border: 1px solid var(--line);
}

.subject-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  font-weight: 700;
}

.progress-bar {
  height: 10px;
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
}

.progress-bar > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--accent-strong));
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.5rem;
}

.calendar-cell {
  min-height: 72px;
  background: rgba(20, 23, 28, 0.8);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.55rem 0.35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.calendar-cell:hover {
  transform: translateY(-1px);
}

.calendar-cell.off-range {
  opacity: 0.45;
}

.calendar-cell.complete {
  border-color: rgba(117, 211, 144, 0.35);
  background: rgba(117, 211, 144, 0.12);
}

.calendar-cell.partial {
  border-color: rgba(240, 199, 107, 0.35);
  background: rgba(240, 199, 107, 0.1);
}

.calendar-cell.failed {
  border-color: rgba(255, 91, 91, 0.3);
  background: rgba(255, 91, 91, 0.08);
}

.calendar-date {
  font-weight: 700;
  font-size: 0.88rem;
}

.calendar-status {
  font-size: 0.54rem;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  color: var(--muted);
}

.quotes-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.quote-history-item {
  padding: 0.9rem 1rem;
  border-radius: 14px;
  background: rgba(20, 23, 28, 0.8);
  border: 1px solid var(--line);
  color: var(--text);
  line-height: 1.5;
}

.quote-history-item small {
  display: block;
  margin-top: 0.35rem;
  color: var(--muted);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn,
.update-btn,
.nav-btn {
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.02);
  color: var(--text);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.action-btn:hover,
.update-btn:hover,
.nav-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(255,255,255,0.14);
}

.action-btn.primary {
  background: linear-gradient(140deg, var(--accent), #7c1212);
  border-color: rgba(255,255,255,0.08);
}

.action-btn.warning {
  border-color: rgba(240, 199, 107, 0.22);
  color: var(--warning);
}

.action-btn.danger {
  border-color: rgba(255, 91, 91, 0.2);
  color: var(--danger);
}

.app-version {
  margin-top: 0.5rem;
  color: var(--muted);
  font-size: 0.8rem;
}

.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.9rem;
  width: min(92vw, 620px);
  display: grid;
  grid-template-columns: repeat(5, minmax(0,1fr));
  gap: 0.3rem;
  padding: 0.5rem;
  border-radius: 18px;
}

.nav-btn {
  padding: 0.7rem 0.3rem;
  font-size: 0.75rem;
  letter-spacing: 0.06rem;
  text-transform: uppercase;
  color: var(--muted);
}

.nav-btn.active {
  background: rgba(198, 45, 45, 0.14);
  border-color: rgba(198, 45, 45, 0.28);
  color: var(--text);
}

.hidden {
  display: none !important;
}

@media (max-width: 440px) {
  .app-shell {
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }

  .hero-meta {
    grid-template-columns: 1fr;
  }

  .task-item {
    align-items: flex-start;
  }

  .task-main {
    align-items: flex-start;
  }
}
