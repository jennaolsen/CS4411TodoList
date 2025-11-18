
let editingIndex = null;
let selectedIndex = null;
document.addEventListener("DOMContentLoaded", loadTasks);

document.getElementById("addBtn").onclick = addTask;
document.getElementById("addDateBtn").onclick = () => {
    document.getElementById("dateInput").style.display = "inline";
};

document.getElementById("deleteButton").onclick = () => {
    if (selectedIndex !== null) {
        deleteTask(selectedIndex);
    }
}
document.getElementById("editButton").onclick = () => {
    if (selectedIndex !== null) {
        editTask(selectedIndex);
        selectedIndex = null;
    }
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
}

function addTask() {
    const text = document.getElementById("taskInput").value.trim();
    const date = document.getElementById("dateInput").value || null;
    if (!text) return;

    const task = {
        id: crypto.randomUUID(),
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
    if (tasks.length === 0) {
        selectedIndex = null;       // no tasks left
    } else if (i >= tasks.length) {
        selectedIndex = tasks.length - 1;  // deleted the last item → select new last item
    } else {
        selectedIndex = i;          // select the item that shifted into this index
    }
    saveTasks(tasks);
    renderTasks();
}

function toggleDone(i) {
    let tasks = loadTasks();
    const task = tasks.find(t => t.id === i);
    if (!task) return;

    task.done = !task.done;
    saveTasks(tasks);
    const taskCompleted = task.done;
    renderTasks();

    if (taskCompleted){
         setTimeout(() => triggerConfetti(), 50);
    }
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
        li.classList.toggle("selected", i === selectedIndex);
        let checkbox = document.createElement("input");
        checkbox.dataset.id = t.id;
        checkbox.type = "checkbox";
        checkbox.checked = t.done;
        checkbox.onclick = (e) => {
            e.stopPropagation();
            toggleDone(t.id);
        };

        let due = t.due ? ` (Due: ${formatDate(t.due)})` : "";
        let taskText = document.createElement("span");
        taskText.textContent = `${t.text}${due}`;
        li.onclick = () => {
            selectedIndex = i;
            renderTasks();
        };
        li.appendChild(checkbox);
        li.appendChild(taskText);

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
