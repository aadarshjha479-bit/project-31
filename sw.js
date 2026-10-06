const STORAGE_KEY = 'project31-state-v1';
const APP_VERSION = '1.0.0';
const OCTOBER_START = { month: 9, day: 5 };
const OCTOBER_END = { month: 9, day: 31 };

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

function getCurrentYear() {
  return new Date().getFullYear();
}

function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatLongDate(date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDisplayDate(dateString) {
  return formatDate(parseDateString(dateString));
}

function createTaskPlan() {
  const year = getCurrentYear();
  const startDate = new Date(year, OCTOBER_START.month, OCTOBER_START.day);
  const endDate = new Date(year, OCTOBER_END.month, OCTOBER_END.day);

  let plan = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const dateString = getDateString(current);
    const dayNumber = Math.floor((current - startDate) / (1000 * 60 * 60 * 24)) + 1;

    let tasks = [];
    const taskMap = [
      { subject: 'Accountancy', chapter: 'Partnership', title: 'Revise key concepts and solve 5 questions', points: 18, type: 'concept' },
      { subject: 'Business Studies', chapter: 'Nature and Significance', title: 'Read chapter summary and highlight key terms', points: 14, type: 'theory' },
      { subject: 'Economics', chapter: 'Development Experience', title: 'Study topic notes and write 3 bullet points', points: 16, type: 'notes' },
      { subject: 'Informatics Practices', chapter: 'Python Basics', title: 'Practice 2 Python exercises and debug errors', points: 18, type: 'practice' },
      { subject: 'SQL', chapter: 'Queries', title: 'Solve SQL SELECT and WHERE practice questions', points: 17, type: 'practice' },
      { subject: 'Accountancy', chapter: 'Company Accounts', title: 'Complete one chapter-based worksheet', points: 20, type: 'worksheet' }
    ];

    const rotated = taskMap.map((task, index) => ({
      ...task,
      id: `${dateString}-${index + 1}`,
      date: dateString,
      day: dayNumber
    }));

    rotated.forEach((task, index) => {
      if (index === 0) {
        task.subject = dayNumber % 2 === 0 ? 'Accountancy' : 'Economics';
      }
      if (index === 1) {
        task.subject = dayNumber % 3 === 0 ? 'Business Studies' : 'Accountancy';
      }
      if (index === 2) {
        task.subject = dayNumber % 2 === 0 ? 'Economics' : 'Business Studies';
      }
      if (index === 3) {
        task.subject = dayNumber % 4 === 0 ? 'Informatics Practices' : 'Python';
      }
      if (index === 4) {
        task.subject = 'SQL';
      }
      if (index === 5) {
        task.subject = dayNumber % 2 === 0 ? 'Business Studies' : 'Accountancy';
      }
    });

    tasks = rotated.map((task, index) => ({
      ...task,
      chapter: `${task.chapter} • ${dayNumber}`,
      title: task.title,
      order: index + 1,
      done: false,
      points: task.points
    }));

    plan.push({ date: dateString, day: dayNumber, tasks });
    current = new Date(current);
    current.setDate(current.getDate() + 1);
  }

  return plan;
}

function safeLoadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        taskStatus: {},
        quoteHistory: [],
        lastQuoteDate: null,
        lastViewDate: null,
        settings: {
          theme: 'dark'
        },
        version: APP_VERSION
      };
    }

    const parsed = JSON.parse(stored);
    return {
      taskStatus: parsed.taskStatus || {},
      quoteHistory: parsed.quoteHistory || [],
      lastQuoteDate: parsed.lastQuoteDate || null,
      lastViewDate: parsed.lastViewDate || null,
      settings: parsed.settings || { theme: 'dark' },
      version: parsed.version || APP_VERSION
    };
  } catch (error) {
    return {
      taskStatus: {},
      quoteHistory: [],
      lastQuoteDate: null,
      lastViewDate: null,
      settings: { theme: 'dark' },
      version: APP_VERSION
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getPlan() {
  const storedPlan = localStorage.getItem('project31-plan-v1');
  if (!storedPlan) {
    const plan = createTaskPlan();
    localStorage.setItem('project31-plan-v1', JSON.stringify(plan));
    return plan;
  }
  return JSON.parse(storedPlan);
}

function updateQuoteSystem() {
  const today = getDateString(new Date());

  if (state.lastQuoteDate !== today) {
    const used = state.quoteHistory || [];
    const available = QUOTES.filter((quote) => !used.includes(quote));
    const nextQuote = available.length ? available[Math.floor(Math.random() * available.length)] : QUOTES[Math.floor(Math.random() * QUOTES.length)];

    state.quoteHistory = [...(state.quoteHistory || []), nextQuote];
    state.lastQuoteDate = today;
    saveState();
  }
}

function getTodayPlan() {
  const dateString = getDateString(new Date());
  const plan = getPlan();
  return plan.find((entry) => entry.date === dateString) || plan[0];
}

function getDayFromDate(dateString) {
  const plan = getPlan();
  return plan.find((entry) => entry.date === dateString) || null;
}

function toggleTask(taskId, checked) {
  state.taskStatus[taskId] = checked;
  saveState();
  renderAll();
}

function getTaskStatus(taskId) {
  return Boolean(state.taskStatus[taskId]);
}

function calculatePointsForEntry(dayEntry) {
  if (!dayEntry) return 0;

  const totalPoints = dayEntry.tasks.reduce((sum, task) => sum + task.points, 0);
  const completedPoints = dayEntry.tasks.reduce((sum, task) => sum + (getTaskStatus(task.id) ? task.points : 0), 0);
  const missed = dayEntry.tasks.filter((task) => !getTaskStatus(task.id)).length;
  const bonus = dayEntry.tasks.every((task) => getTaskStatus(task.id)) ? 25 : 0;
  const penalty = missed * 5;

  return completedPoints + bonus - penalty;
}

function getMissionSummaryForDate(dateString) {
  const entry = getDayFromDate(dateString);
  if (!entry) return { total: 0, done: 0, remaining: 0, complete: false, points: 0 };

  const total = entry.tasks.length;
  const done = entry.tasks.filter((task) => getTaskStatus(task.id)).length;
  const remaining = total - done;
  const complete = done === total;
  const points = calculatePointsForEntry(entry);

  return { total, done, remaining, complete, points };
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
  const plan = getPlan();
  const entry = plan.find((item) => item.date === today);
  return entry ? entry.day : 1;
}

function getOverallPoints() {
  const plan = getPlan();
  return plan.reduce((sum, entry) => sum + calculatePointsForEntry(entry), 0);
}

function getCurrentStreak() {
  const plan = getPlan();
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 60; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = getDateString(date);
    const entry = plan.find((item) => item.date === dateString);

    if (!entry) break;

    const done = entry.tasks.every((task) => getTaskStatus(task.id));
    if (!done) break;
    streak += 1;
  }

  return streak;
}

function renderDashboard() {
  const today = getTodayPlan();
  const mission = getMissionSummaryForDate(today.date);
  const overallProgress = getOverallProgress();
  const daysRemaining = Math.max(0, 31 - getCurrentDayNumber());
  const todayProgress = today ? Math.round((mission.done / Math.max(mission.total, 1)) * 100) : 0;

  document.getElementById('currentDateText').textContent = formatLongDate(new Date());
  document.getElementById('currentDayText').textContent = `${getCurrentDayNumber()} / 31`;
  document.getElementById('daysRemainingText').textContent = `${daysRemaining} days`;
  document.getElementById('overallProgressText').textContent = `${overallProgress}%`;
  document.getElementById('todayProgressText').textContent = `${todayProgress}%`;
  document.getElementById('pointsText').textContent = `${getOverallPoints()}`;
  document.getElementById('streakText').textContent = `${getCurrentStreak()}`;

  const dashboardMissionList = document.getElementById('dashboardMissionList');
  dashboardMissionList.innerHTML = '';

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
    dashboardMissionList.appendChild(item);
  });

  const missionBadge = document.getElementById('missionStatusBadge');
  missionBadge.textContent = mission.complete ? 'COMPLETE' : 'INCOMPLETE';
  missionBadge.classList.toggle('success', mission.complete);

  const quoteText = document.getElementById('quoteText');
  const usedQuotes = state.quoteHistory || [];
  const latestQuote = usedQuotes[usedQuotes.length - 1] || QUOTES[0];
  quoteText.textContent = `"${latestQuote}"`;
}

function renderMissionScreen() {
  const today = getTodayPlan();
  const mission = getMissionSummaryForDate(today.date);

  document.getElementById('missionTitle').textContent = `DAY ${today.day}`;
  document.getElementById('missionCountText').textContent = `${mission.done}/${mission.total} COMPLETE`;

  const taskList = document.getElementById('missionTaskList');
  taskList.innerHTML = '';

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
    taskList.appendChild(item);
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

  const subjectList = document.getElementById('subjectProgressList');
  subjectList.innerHTML = '';

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
    subjectList.appendChild(card);
  });
}

function renderCalendarScreen() {
  const calendar = document.getElementById('calendarGrid');
  const plan = getPlan();
  const today = new Date();
  const start = new Date(today.getFullYear(), 9, 1);
  const end = new Date(today.getFullYear(), 9, 31);

  calendar.innerHTML = '';

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach((name) => {
    const label = document.createElement('div');
    label.className = 'calendar-cell off-range';
    label.innerHTML = `<span class="calendar-date">${name}</span>`;
    calendar.appendChild(label);
  });

  const firstDay = start.getDay();
  for (let i = 0; i < firstDay; i += 1) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell off-range';
    calendar.appendChild(emptyCell);
  }

  for (let d = 1; d <= 31; d += 1) {
    const date = new Date(today.getFullYear(), 9, d);
    const dateString = getDateString(date);
    const entry = plan.find((item) => item.date === dateString);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-cell';

    if (!entry) {
      cell.classList.add('off-range');
    } else {
      const summary = getMissionSummaryForDate(dateString);
      if (summary.complete) cell.classList.add('complete');
      else if (summary.done > 0) cell.classList.add('partial');
      else cell.classList.add('failed');
      cell.title = `${summary.done}/${summary.total} tasks complete`;
    }

    cell.innerHTML = `
      <span class="calendar-date">${d}</span>
      <span class="calendar-status">${entry ? (getMissionSummaryForDate(dateString).complete ? 'done' : 'open') : ''}</span>
    `;

    if (entry) {
      cell.addEventListener('click', () => {
        const mission = getMissionSummaryForDate(dateString);
        alert(`${formatDate(date)}\n${mission.done}/${mission.total} tasks complete\nPoints: ${calculatePointsForEntry(entry)}`);
      });
    }

    calendar.appendChild(cell);
  }
}

function renderQuoteHistory() {
  const list = document.getElementById('quoteHistoryList');
  list.innerHTML = '';
  (state.quoteHistory || []).slice().reverse().forEach((quote) => {
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
  updateStatusBadge();
}

function updateStatusBadge() {
  const today = getTodayPlan();
  const summary = getMissionSummaryForDate(today.date);
  const badge = document.getElementById('missionStatusBadge');
  if (badge) {
    badge.textContent = summary.complete ? 'COMPLETE' : 'INCOMPLETE';
    badge.classList.toggle('success', summary.complete);
  }
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
    state
  }, null, 2);

  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project-31-export.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed.state) {
        throw new Error('Invalid export');
      }
      state = parsed.state;
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
  if (!confirm('Reset Project 31? This will clear all completion data and quotes.')) return;
  state = {
    taskStatus: {},
    quoteHistory: [],
    lastQuoteDate: null,
    lastViewDate: null,
    settings: { theme: 'dark' },
    version: APP_VERSION
  };
  localStorage.removeItem('project31-plan-v1');
  saveState();
  renderAll();
}

function wireEvents() {
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.addEventListener('click', () => setActiveScreen(button.dataset.screen));
  });

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-task-toggle]');
    if (toggle) {
      const checked = toggle.checked;
      toggleTask(toggle.dataset.taskToggle, checked);
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

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('./sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;

      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          const button = document.getElementById('updateBtn');
          button.classList.remove('hidden');
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
      const button = document.getElementById('updateBtn');
      button.classList.remove('hidden');
    }
  });

  const updateButton = document.getElementById('updateBtn');
  updateButton.addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  });
}

function init() {
  state = safeLoadState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateQuoteSystem();
  renderAll();
  setActiveScreen('dashboard');
  wireEvents();
  registerServiceWorker();
}

init();
