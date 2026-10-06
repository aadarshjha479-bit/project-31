const STORAGE_KEY = 'project31-state-v1';
const PLAN_KEY = 'project31-plan-v1';
const APP_VERSION = '1.0.0';

const QUOTES = [
  'Every day you waste is one less day available to become the person you said you would become.',
  'Discipline is not a mood. It is a decision executed repeatedly.',
  'You are not falling behind because the day is hard. You are falling behind because you keep postponing the work.',
  'The future you want does not arrive by accident. It is built in the hours you refuse to waste.',
  'If you can do this today, you stop being a spectator of your own life.',
  'Your excuses are not stronger than your commitment. They are just louder.',
  'A missed day is not a reset. It is a cost.',
  'Execution is the only real speech that matters in the long run.',
  'The work does not become lighter. You become stronger by doing it.',
  'When the future is uncertain, the only reliable move is to execute.'
];

const SUBJECT_COLORS = {
  Accountancy: '#d55d5d',
  'Business Studies': '#e39a53',
  Economics: '#7ba8ff',
  'Indian Economic Development': '#6bd3d0',
  Macroeconomics: '#8cbf73',
  'Informatics Practices': '#bf8ef5',
  Python: '#ab86ff',
  SQL: '#f4b942',
  English: '#d0d0d0'
};

let state = null;

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function buildTaskPlan() {
  const year = new Date().getFullYear();
  const startDate = new Date(year, 9, 5);
  const endDate = new Date(year, 9, 31);
  const plan = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const dateString = getDateString(current);
    const dayNumber = Math.floor((current - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const baseTasks = [
      {
        subject: dayNumber % 2 === 0 ? 'Accountancy' : 'Economics',
        chapter: 'Concept Revision',
        title: 'Revise chapter notes and solve 5 questions.',
        points: 18,
        type: 'Concept'
      },
      {
        subject: dayNumber % 3 === 0 ? 'Business Studies' : 'Accountancy',
        chapter: 'Chapter Summary',
        title: 'Read the chapter summary and highlight critical points.',
        points: 14,
        type: 'Theory'
      },
      {
        subject: dayNumber % 2 === 0 ? 'Economics' : 'Business Studies',
        chapter: 'Case Practice',
        title: 'Apply concept to a case-based question or example.',
        points: 16,
        type: 'Practice'
      },
      {
        subject: dayNumber % 4 === 0 ? 'Informatics Practices' : 'Python',
        chapter: 'Python / IP Drill',
        title: 'Practice one coding problem or worksheet question.',
        points: 18,
        type: 'Practice'
      },
      {
        subject: 'SQL',
        chapter: 'SQL Queries',
        title: 'Solve 2 SQL queries with SELECT, WHERE, and ORDER BY.',
        points: 17,
        type: 'Practice'
      },
      {
        subject: dayNumber % 2 === 0 ? 'Business Studies' : 'Accountancy',
        chapter: 'Daily Worksheet',
        title: 'Complete one worksheet question or written task.',
        points: 20,
        type: 'Worksheet'
      }
    ];

    const tasks = baseTasks.map((task, index) => ({
      id: `${dateString}-${index + 1}`,
      date: dateString,
      day: dayNumber,
      subject: task.subject,
      chapter: task.chapter,
      title: task.title,
      points: task.points,
      type: task.type,
      done: false,
      order: index + 1
    }));

    plan.push({
      date: dateString,
      day: dayNumber,
      tasks
    });

    current = new Date(current);
    current.setDate(current.getDate() + 1);
  }

  return plan;
}

function getPlan() {
  const existing = localStorage.getItem(PLAN_KEY);
  if (!existing) {
    const plan = buildTaskPlan();
    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    return plan;
  }
  return JSON.parse(existing);
}

function defaultState() {
  return {
    taskStatus: {},
    quoteHistory: [],
    lastQuoteDate: null,
    settings: { theme: 'dark' },
    version: APP_VERSION
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }

    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
      taskStatus: parsed.taskStatus || {},
      quoteHistory: parsed.quoteHistory || [],
      settings: parsed.settings || { theme: 'dark' }
    };
  } catch (error) {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getTodayPlan() {
  const today = getDateString(new Date());
  const plan = getPlan();
  return plan.find((entry) => entry.date === today) || plan[0];
}

function getEntryByDate(dateString) {
  return getPlan().find((entry) => entry.date === dateString) || null;
}

function getTaskStatus(taskId) {
  return Boolean(state.taskStatus[taskId]);
}

function toggleTask(taskId, done) {
  state.taskStatus[taskId] = done;
  saveState();
  renderAll();
}

function getDailySummary(dateString) {
  const entry = getEntryByDate(dateString);
  if (!entry) {
    return { total: 0, done: 0, remaining: 0, complete: false, points: 0 };
  }

  const total = entry.tasks.length;
  const done = entry.tasks.filter((task) => getTaskStatus(task.id)).length;
  const remaining = total - done;
  const complete = done === total;
  const points = calculateDayPoints(entry);

  return { total, done, remaining, complete, points };
}

function calculateDayPoints(entry) {
  if (!entry) return 0;

  let earned = 0;
  entry.tasks.forEach((task) => {
    if (getTaskStatus(task.id)) earned += task.points;
  });

  const missed = entry.tasks.filter((task) => !getTaskStatus(task.id)).length;
  const bonus = entry.tasks.every((task) => getTaskStatus(task.id)) ? 25 : 0;
  const penalty = missed * 5;
  return earned + bonus - penalty;
}

function getOverallProgress() {
  const plan = getPlan();
  let total = 0;
  let done = 0;

  plan.forEach((entry) => {
    total += entry.tasks.length;
    done += entry.tasks.filter((task) => getTaskStatus(task.id)).length;
  });

  return total ? Math.round((done / total) * 100) : 0;
}

function getCurrentDayNumber() {
  const today = getDateString(new Date());
  const entry = getEntryByDate(today);
  return entry ? entry.day : 1;
}

function getOverallPoints() {
  const plan = getPlan();
  return plan.reduce((sum, entry) => sum + calculateDayPoints(entry), 0);
}

function getCurrentStreak() {
  const plan = getPlan();
  let streak = 0;
  const today = new Date();

  for (let offset = 0; offset < 60; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dateString = getDateString(date);
    const entry = plan.find((item) => item.date === dateString);
    if (!entry) break;

    const isComplete = entry.tasks.every((task) => getTaskStatus(task.id));
    if (!isComplete) break;
    streak += 1;
  }

  return streak;
}

function updateQuoteSystem() {
  const today = getDateString(new Date());
  if (state.lastQuoteDate === today) return;

  const used = state.quoteHistory || [];
  const pool = QUOTES.filter((quote) => !used.includes(quote));
  const nextQuote = pool.length ? pool[Math.floor(Math.random() * pool.length)] : QUOTES[Math.floor(Math.random() * QUOTES.length)];

  state.quoteHistory = [...used, nextQuote];
  state.lastQuoteDate = today;
  saveState();
}

function renderDashboard() {
  const today = getTodayPlan();
  const summary = getDailySummary(today.date);
  const overall = getOverallProgress();
  const dayNumber = getCurrentDayNumber();
  const daysRemaining = Math.max(0, 31 - dayNumber);
  const todayProgress = summary.total ? Math.round((summary.done / summary.total) * 100) : 0;

  document.getElementById('currentDateText').textContent = formatLongDate(new Date());
  document.getElementById('currentDayText').textContent = `${dayNumber} / 31`;
  document.getElementById('daysRemainingText').textContent = `${daysRemaining} days`;
  document.getElementById('overallProgressText').textContent = `${overall}%`;
  document.getElementById('todayProgressText').textContent = `${todayProgress}%`;
  document.getElementById('pointsText').textContent = `${getOverallPoints()}`;
  document.getElementById('streakText').textContent = `${getCurrentStreak()}`;

  const list = document.getElementById('dashboardMissionList');
  list.innerHTML = '';

  today.tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item ${getTaskStatus(task.id) ? 'done' : ''}`;
    item.innerHTML = `
      <div class="task-main">
        <input type="checkbox" ${getTaskStatus(task.id) ? 'checked' : ''} data-task-toggle="${task.id}" />
        <div class="task-copy">
          <span class="task-subject">${task.subject}</span>
          <span class="task-title">${task.title}</span>
        </div>
      </div>
      <span class="task-points">+${task.points}</span>
    `;
    list.appendChild(item);
  });

  const badge = document.getElementById('missionStatusBadge');
  badge.textContent = summary.complete ? 'Complete' : 'Incomplete';
  badge.classList.toggle('success', summary.complete);

  const quoteText = document.getElementById('quoteText');
  const history = state.quoteHistory || [];
  const latest = history.length ? history[history.length - 1] : QUOTES[0];
  quoteText.textContent = `"${latest}"`;
}

function renderMissionScreen() {
  const today = getTodayPlan();
  const summary = getDailySummary(today.date);

  document.getElementById('missionTitle').textContent = `DAY ${today.day}`;
  document.getElementById('missionCountText').textContent = `${summary.done}/${summary.total} complete`;

  const list = document.getElementById('missionTaskList');
  list.innerHTML = '';

  today.tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item ${getTaskStatus(task.id) ? 'done' : ''}`;
    item.innerHTML = `
      <div class="task-main">
        <input type="checkbox" ${getTaskStatus(task.id) ? 'checked' : ''} data-task-toggle="${task.id}" />
        <div class="task-copy">
          <span class="task-subject">${task.subject}</span>
          <span class="task-title">${task.title}</span>
          <div class="task-meta">
            <span>${task.chapter}</span>
            <span>•</span>
            <span>${task.type}</span>
          </div>
        </div>
      </div>
      <span class="task-points">+${task.points}</span>
    `;
    list.appendChild(item);
  });
}

function renderProgressScreen() {
  const plan = getPlan();
  const subjectMap = {};

  plan.forEach((entry) => {
    entry.tasks.forEach((task) => {
      if (!subjectMap[task.subject]) {
        subjectMap[task.subject] = { total: 0, done: 0 };
      }

      subjectMap[task.subject].total += 1;
      if (getTaskStatus(task.id)) {
        subjectMap[task.subject].done += 1;
      }
    });
  });

  const list = document.getElementById('subjectProgressList');
  list.innerHTML = '';

  Object.entries(subjectMap).forEach(([subject, data]) => {
    const percent = data.total ? Math.round((data.done / data.total) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subject-head">
        <span>${subject}</span>
        <span>${percent}%</span>
      </div>
      <div class="progress-bar">
        <span style="width:${percent}%; background: linear-gradient(90deg, ${SUBJECT_COLORS[subject] || '#d55d5d'}, #ff4b4b);"></span>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderCalendarScreen() {
  const calendar = document.getElementById('calendarGrid');
  calendar.innerHTML = '';

  const headings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  headings.forEach((heading) => {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell off-range';
    cell.innerHTML = `<span class="calendar-date">${heading}</span>`;
    calendar.appendChild(cell);
  });

  const year = new Date().getFullYear();
  const start = new Date(year, 9, 1);
  const firstDay = start.getDay();

  for (let i = 0; i < firstDay; i += 1) {
    const empty = document.createElement('div');
    empty.className = 'calendar-cell off-range';
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= 31; day += 1) {
    const date = new Date(year, 9, day);
    const dateString = getDateString(date);
    const entry = getEntryByDate(dateString);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-cell';

    if (!entry) {
      cell.classList.add('off-range');
    } else {
      const summary = getDailySummary(dateString);
      if (summary.complete) cell.classList.add('complete');
      else if (summary.done > 0) cell.classList.add('partial');
      else cell.classList.add('failed');
    }

    cell.innerHTML = `
      <span class="calendar-date">${day}</span>
      <span class="calendar-status">${entry ? (getDailySummary(dateString).complete ? 'done' : 'open') : ''}</span>
    `;

    if (entry) {
      cell.addEventListener('click', () => {
        const summary = getDailySummary(dateString);
        alert(`${formatDate(date)}\n${summary.done}/${summary.total} tasks complete\nPoints: ${summary.points}`);
      });
    }

    calendar.appendChild(cell);
  }
}

function renderQuoteHistory() {
  const list = document.getElementById('quoteHistoryList');
  list.innerHTML = '';

  const items = [...(state.quoteHistory || [])].reverse();
  items.forEach((quote) => {
    const item = document.createElement('div');
    item.className = 'quote-history-item';
    item.innerHTML = `<p>“${quote}”</p><small>Disciplined memory</small>`;
    list.appendChild(item);
  });
}

function renderVersion() {
  document.getElementById('appVersionText').textContent = APP_VERSION;
}

function renderAll() {
  renderDashboard();
  renderMissionScreen();
  renderProgressScreen();
  renderCalendarScreen();
  renderQuoteHistory();
  renderVersion();
}

function setActiveScreen(screenName) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === `screen-${screenName}`);
  });

  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.screen === screenName);
  });
}

function exportData() {
  const payload = JSON.stringify({
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    state,
    plan: getPlan()
  }, null, 2);

  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'project-31-export.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (!data.state) throw new Error('Invalid import data');
      state = { ...defaultState(), ...data.state };
      saveState();
      renderAll();
    } catch (error) {
      alert('Unable to import this file.');
    }
  };
  reader.readAsText(file);
}

function resetTodayProgress() {
  const today = getTodayPlan();
  today.tasks.forEach((task) => {
    delete state.taskStatus[task.id];
  });
  saveState();
  renderAll();
}

function resetProject31() {
  const confirmed = window.confirm('Reset Project 31? This will clear all progress and quotes.');
  if (!confirmed) return;

  state = defaultState();
  localStorage.removeItem(PLAN_KEY);
  localStorage.removeItem(STORAGE_KEY);
  saveState();
  renderAll();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('./sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          const button = document.getElementById('updateBtn');
          if (button) button.classList.remove('hidden');
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
      const button = document.getElementById('updateBtn');
      if (button) button.classList.remove('hidden');
    }
  });

  const updateBtn = document.getElementById('updateBtn');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    });
  }
}

function bindEvents() {
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => setActiveScreen(button.dataset.screen));
  });

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-task-toggle]');
    if (toggle) {
      toggleTask(toggle.dataset.taskToggle, toggle.checked);
      return;
    }

    const action = event.target.closest('[data-action]');
    if (!action) return;

    const actionName = action.dataset.action;
    if (actionName === 'export') exportData();
    if (actionName === 'import') document.getElementById('importFileInput').click();
    if (actionName === 'reset-today') resetTodayProgress();
    if (actionName === 'reset-all') resetProject31();
    if (actionName === 'update') {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    }
  });

  document.getElementById('importFileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    importData(file);
    event.target.value = '';
  });
}

function init() {
  state = loadState();
  if (!state.quoteHistory || !state.quoteHistory.length) {
    updateQuoteSystem();
  }

  setActiveScreen('dashboard');
  renderAll();
  bindEvents();
  registerServiceWorker();
}

init();
