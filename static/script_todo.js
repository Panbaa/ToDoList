// Funktion zum Abrufen der Todos und Anzeigen in der Liste
function getTodos() {
    fetch('/todos')
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = '';
            data.forEach(todo => {
                const li = document.createElement('li');
                li.textContent = todo.content;
                todoList.appendChild(li);
            });
        });
}

// Funktion zum Hinzufügen eines Todos
function addTodo() {
    const input = document.getElementById('todo-input');
    const content = input.value;
    fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content })
    })
    .then(response => {
        if (response.ok) {
            input.value = '';
            getTodos(); // Aktualisiere die Todo-Liste nach dem Hinzufügen
        }
    });
}

// Eventlistener für den "Add Todo"-Button hinzufügen
document.getElementById('add-todo-btn').addEventListener('click', addTodo);

// Beim Laden der Seite die Todos abrufen und anzeigen
getTodos();