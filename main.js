const addTask = document.querySelector(".addTask-btn");
const taskName = document.querySelector(".taskName");
const taskDescription = document.querySelector(".taskDescription");
const taskList = document.querySelector(".taskList");
const confirmEditBtn = document.querySelector(".confirmEdit-btn");

let editedIndex = null;

addTask.onclick = function (e) {
  e.preventDefault();

  const taskNameValue = taskName.value.trim();
  const taskDescriptionValue = taskDescription.value.trim();
  const taskDate = new Date().toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const task = {
    name: taskNameValue,
    description: taskDescriptionValue,
    createdAt: taskDate,
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskName.value = "";
  taskDescription.value = "";

  renderTasks();
};

function renderTasks() {
  taskList.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    taskItem.innerHTML = `
      <div class="taskInformation">
        <h3 class="taskTitle">${task.name}</h3>
        <p class="taskDescription">${task.description}</p>
        <p class="taskDate">Task added on ${task.createdAt}</p>
      </div>
      <div class="taskActions">
        <button class="editTask-btn" data-index="${index}">Edit</button>
        <button class="deleteTask-btn" data-index="${index}">Delete</button>
        <input type="checkbox" class="taskStatus" />
      </div>
    `;

    taskList.appendChild(taskItem);
  });

  document.querySelectorAll(".editTask-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      loadTaskForEditing(index);
    });
  });

  document.querySelectorAll(".deleteTask-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deleteTask(index);
    });
  });
  document.querySelectorAll(".taskStatus").forEach((checkbox, index) => {
    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        markTaskAsCompleted(index);
      }
    });
  });
}
function markTaskAsCompleted(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

  const completedTask = tasks[index];
  completedTask.completedAt = new Date().toISOString();
  completedTasks.push(completedTask);
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function loadTaskForEditing(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];

  taskName.value = task.name;
  taskDescription.value = task.description;
  editedIndex = index;
  confirmEditBtn.classList.remove("d-none");
}

confirmEditBtn.onclick = function () {
  const taskNameValue = taskName.value.trim();
  const taskDescriptionValue = taskDescription.value.trim();
  const taskDate = new Date().toLocaleString();

  const updatedTask = {
    name: taskNameValue,
    description: taskDescriptionValue,
    createdAt: taskDate,
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (editedIndex !== null) {
    tasks[editedIndex] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    editedIndex = null;
    confirmEditBtn.classList.add("d-none");
    taskName.value = "";
    taskDescription.value = "";
  }
};

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

window.onload = function () {
  renderTasks();
};
