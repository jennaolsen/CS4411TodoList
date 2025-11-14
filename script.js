
let editingIndex = null;

document.addEventListener("DOMContentLoaded", loadTasks);

document.getElementById("addBtn").onclick = addTask;
document.getElementById("addDateBtn").onclick = () => {
    document.getElementById("dateInput").style.display = "inline";
};

function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const date = document.getElementById("dateInput").value || null;
    if (!text) return;

    const task = {
        text,
        done: false,
        due: date
    };

    let tasks = loadTasks();
    if (editingIndex !== null) {
        tasks[editingIndex] = task;
        editingIndex = null;
        document.getElementById("addBtn").innerText = "Add Task";
    } else {
        tasks.push(task);
    }

    saveTasks(tasks);
    renderTasks();
    document.getElementById("taskInput").value = "";
    document.getElementById("dateInput").value = "";
    document.getElementById("dateInput").style.display = "none";
}

function deleteTask(i) {
    let tasks = loadTasks();
    tasks.splice(i, 1);
    saveTasks(tasks);
    renderTasks();
}

function toggleDone(i) {
    let tasks = loadTasks();
    tasks[i].done = !tasks[i].done;
    saveTasks(tasks);
    renderTasks();

    if (tasks[i].done) triggerConfetti();
}

function editTask(i) {
    let tasks = loadTasks();
    document.getElementById("taskInput").value = tasks[i].text;
    document.getElementById("addBtn").innerText = "Done";

    if (tasks[i].due) {
        document.getElementById("dateInput").value = tasks[i].due;
        document.getElementById("dateInput").style.display = "inline";
    }

    editingIndex = i;
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function renderTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let tasks = loadTasks();

    tasks.sort((a, b) => {
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due) - new Date(b.due);
    });

    tasks.forEach((t, i) => {
        let li = document.createElement("li");
        let due = t.due ? ` (Due ${t.due})` : " (No Due Date)";
        li.innerHTML = `
            <span>
                <input type="checkbox" ${t.done ? "checked" : ""} onclick="toggleDone(${i})">
                ${t.text}${due}
            </span>
            <span>
                <button class = "edit-button" onclick="editTask(${i})">Edit</button>
                <span class="delete-btn" onclick="deleteTask(${i})">✖</span>
            </span>
        `;
        list.appendChild(li);
    });

    updateStatus();
}

function updateStatus() {
    let tasks = loadTasks();
    let done = tasks.filter(t => t.done).length;
    document.getElementById("status").innerText =
        `${done} tasks out of ${tasks.length} complete`;
}

// Confetti (simple emoji animation)
function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { 
            y: 0.6
        }
    });
}

renderTasks();
