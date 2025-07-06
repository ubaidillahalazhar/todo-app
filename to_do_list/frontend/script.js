const apiBase = "http://localhost:5000";

async function loadTasks() {
  const res = await fetch(`${apiBase}/tasks`);
  const data = await res.json();
  renderTasks(data);
}

function getPriorityClass(priority) {
  switch(priority) {
    case 'Important': return 'important-priority';
    case 'Urgent': return 'urgent-priority';
    case 'Not Important & Not Urgent': return 'not important & not urgent-priority';
    default: return '';
  }
}

function renderTasks(tasks) {
  ['daily', 'weekly'].forEach(cat => {
    const list = document.getElementById(`${cat}Tasks`);
    list.innerHTML = '';
    tasks[cat].forEach((task, index) => {
      const li = document.createElement('li');
      const priorityClass = getPriorityClass(task.priority);

      li.className = priorityClass;
      li.innerHTML = `
        <div>
          <strong>${task.text}</strong> <br/>
          <small>🗓 ${task.deadline} | 🎯 ${task.priority}</small>
        </div>
        <div>
          <button onclick="editTaskPrompt('${cat}', ${index})">Edit</button>
          <button onclick="deleteTask('${cat}', ${index})">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  });
}

async function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  const deadline = document.getElementById('deadlineInput').value;
  const priority = document.getElementById('prioritySelect').value;
  const category = document.getElementById('categorySelect').value;

  if (!text || !deadline || !priority || !category) {
    alert("All fields must be filled out.");
    return;
  }

  const task = { text, deadline, priority };

  await fetch(`${apiBase}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, category })
  });

  document.getElementById('taskInput').value = '';
  document.getElementById('deadlineInput').value = '';
  loadTasks();
}

async function deleteTask(category, index) {
  await fetch(`${apiBase}/tasks/${category}/${index}`, {
    method: 'DELETE'
  });
  loadTasks();
}

async function editTaskPrompt(category, index) {
  const newText = prompt("Update task text:");
  const newDeadline = prompt("Update deadline (YYYY-MM-DD):");
  const newPriority = prompt("Update priority (important, urgent, not important & not urgent):");

  if (newText && newDeadline && newPriority) {
    const newTask = {
      text: newText.trim(),
      deadline: newDeadline,
      priority: newPriority.toLowerCase()
    };

    await fetch(`${apiBase}/tasks/${category}/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask })
    });

    loadTasks();
  }
}

window.onload = loadTasks;