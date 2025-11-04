const addBtn = document.getElementById("addBtn");
const taskText = document.getElementById("taskText");
const taskList = document.getElementById("taskList");

async function addTask() {
  const text = taskText.value.trim();
  if (!text) return;
  const res = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const task = await res.json();
  addTaskToDOM(task);
  taskText.value = "";
  taskText.blur();
  taskText.focus();
}

addBtn.onclick = addTask;

taskText.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.innerHTML = `<span class="task-text">${task.text}</span>
        <button class="toggle">✓</button>
        <button class="delete">✕</button>`;
  taskList.appendChild(li);
  li.scrollIntoView({ behavior: "smooth" });
}

taskList.onclick = async (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = li.dataset.id;

  if (e.target.classList.contains("toggle")) {
    await fetch(`/toggle/${id}`, { method: "POST" });
    li.classList.toggle("done");
  }

  if (e.target.classList.contains("delete")) {
    await fetch(`/delete/${id}`, { method: "POST" });
    li.remove();
  }
};
