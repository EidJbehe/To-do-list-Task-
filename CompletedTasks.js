const container = document.querySelector(".completedTasksList");
function renderCompletedTasks() {
  const completedTasks =
    JSON.parse(localStorage.getItem("completedTasks")) || [];
  container.innerHTML = "";

  if (completedTasks.length === 0) {
    container.innerHTML = "<p>No completed tasks yet.</p>";
    return;
  }

  completedTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    const formattedDate = new Date(task.completedAt).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    taskItem.innerHTML = `
      <div class="taskInformation">
        <h3 class="taskTitle">${task.name}</h3>
        <p class="taskDescription">${task.description}</p>
        <p class="taskDate">Task completed on ${formattedDate}</p>
      </div>
      <div class="taskActions">
        <button class="deleteTask-btn" data-index="${index}">Delete</button>
          <input type="checkbox" checked class="taskStatus" />
      </div>
    `;

    taskItem.querySelector(".deleteTask-btn").addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deleteTask(index);
    });
    taskItem.querySelector(".taskStatus").addEventListener("change", (e) => {
      const index = e.target.getAttribute("data-index");
      moveTaskBackToActive(index);
    });

    container.appendChild(taskItem);
  });
}

function deleteTask(index) {
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  completedTasks.splice(index, 1);
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  renderCompletedTasks();
}
function moveTaskBackToActive(index) {
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = completedTasks.splice(index, 1)[0];
  delete task.completedAt;
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  renderCompletedTasks();
}

window.onload = renderCompletedTasks;
