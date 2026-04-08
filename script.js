/* ================================================
   script.js — Todo App ka poora logic
   ================================================ */

/* ---- Step 1: HTML elements ko grab karo ---- */
const taskInput  = document.getElementById('taskInput');   // Input box
const addBtn     = document.getElementById('addBtn');      // Add button
const taskList   = document.getElementById('taskList');    // <ul> list
const emptyState = document.getElementById('emptyState'); // Empty message
const totalCount = document.getElementById('totalCount'); // Stats: total
const doneCount  = document.getElementById('doneCount');  // Stats: done


/* ================================================
   LOCALSTORAGE FUNCTIONS
   tasks ek array hai: [{id, text, completed}, ...]
   ================================================ */

/* LocalStorage se tasks load karo */
function loadTasks() {
  const raw = localStorage.getItem('myTasks');  // String milegi
  return raw ? JSON.parse(raw) : [];            // Array return karo
}

/* LocalStorage mein tasks save karo */
function saveTasks(tasks) {
  localStorage.setItem('myTasks', JSON.stringify(tasks)); // Array → String
}


/* ================================================
   CORE FUNCTIONS
   ================================================ */

/* Unique ID banana ke liye (Date + random number) */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/* Naya task add karo */
function addTask() {
  const text = taskInput.value.trim(); // Whitespace hatao

  // Khaali input ignore karo
  if (!text) {
    taskInput.focus();
    taskInput.style.borderColor = 'var(--danger)'; // Red border dikhao
    setTimeout(() => {
      taskInput.style.borderColor = '';            // 1 second baad reset
    }, 1000);
    return;
  }

  // Naya task object banao
  const newTask = {
    id: generateId(),
    text: text,
    completed: false
  };

  // Existing tasks lo, naya add karo, save karo
  const tasks = loadTasks();
  tasks.push(newTask);
  saveTasks(tasks);

  // Input clear karo aur focus rakho
  taskInput.value = '';
  taskInput.focus();

  // UI refresh karo
  renderTasks();
}

/* Task complete/incomplete toggle karo */
function toggleTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);  // ID se dhundho
  if (task) {
    task.completed = !task.completed;          // Flip karo
    saveTasks(tasks);
    renderTasks();
  }
}

/* Task delete karo */
function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== id);     // Is ID ko hata do
  saveTasks(tasks);
  renderTasks();
}


/* ================================================
   RENDER FUNCTION — UI update karo
   ================================================ */
function renderTasks() {
  const tasks = loadTasks();

  // List saaf karo (purani items)
  taskList.innerHTML = '';

  // Koi task nahi → empty state dikhao
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    // Har task ke liye ek <li> banao
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id; // ID store karo

      /* --- Checkbox --- */
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.title = task.completed ? 'Incomplete mark karo' : 'Complete mark karo';

      // Checkbox click pe toggle
      checkbox.addEventListener('change', () => toggleTask(task.id));

      /* --- Task Text --- */
      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      /* --- Delete Button --- */
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.innerHTML = '🗑️';
      delBtn.title = 'Delete karo';

      // Delete button click
      delBtn.addEventListener('click', () => deleteTask(task.id));

      /* --- Sab ko <li> mein daalo --- */
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);

      taskList.appendChild(li);
    });
  }

  // Stats update karo
  updateStats(tasks);
}

/* Stats bar update: kitne total, kitne done */
function updateStats(tasks) {
  const total = tasks.length;
  const done  = tasks.filter(t => t.completed).length;

  totalCount.textContent = `${total} task${total !== 1 ? 's' : ''}`;
  doneCount.textContent  = `${done} done`;
}


/* ================================================
   EVENT LISTENERS
   ================================================ */

/* Add button click pe task add karo */
addBtn.addEventListener('click', addTask);

/* Enter key press pe bhi task add ho */
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});


/* ================================================
   APP START — Page load hone pe tasks render karo
   ================================================ */
renderTasks();

/* Focus input on load for quick entry */
taskInput.focus();
