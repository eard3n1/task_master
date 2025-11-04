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
  if (e.key === "Enter") addTask();
});

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <button class="toggle">✓</button>
    <button class="delete">✕</button>
  `;
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

taskList.addEventListener("dblclick", (e) => {
  const span = e.target.closest(".task-text");
  if (!span) return;

  const li = span.closest("li");
  const id = li.dataset.id;
  const oldText = span.textContent;
  const input = document.createElement("input");

  input.type = "text";
  input.value = oldText;
  input.className = "edit-input";
  span.replaceWith(input);
  input.focus();

  const save = async () => {
    const newText = input.value.trim();
    if (newText && newText !== oldText) {
      await fetch(`/edit/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
      input.replaceWith(createTaskSpan(newText));
    } else {
      input.replaceWith(createTaskSpan(oldText));
    }
  };

  input.addEventListener("blur", save);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      input.blur();
    }
  });
});

function createTaskSpan(text) {
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text;
  return span;
}
