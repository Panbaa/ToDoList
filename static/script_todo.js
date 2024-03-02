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
                li.classList.add('todo-item');
                li.id = `todo-${todo.id}`; // Eindeutige ID für jedes Todo
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

// Funktion zum Entfernen eines Todos
function removeTodo(todoId) {
    fetch(`/todos/${todoId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            getTodos(); // Aktualisiere die Todo-Liste nach dem Entfernen
        }
    });
}

// Funktion zum Anzeigen des Popups
function showPopup(todoId) {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupContent = document.getElementById('popup-content');
    popupOverlay.style.display = 'block';
    popupContent.dataset.todoId = todoId; // Speichere die ID des Todos im Popup
}

// Funktion zum Ausblenden des Popups
function hidePopup() {
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'none';
}

// Beim Laden der Seite die Todos abrufen und anzeigen
document.addEventListener('DOMContentLoaded', function() {
    getTodos();
});

// Eventlistener für das Klicken auf die "Add Todo"-Schaltfläche hinzufügen
document.getElementById('add-todo-btn').addEventListener('click', addTodo);

// Eventlistener für das Klicken auf ein Listenelement hinzufügen
document.getElementById('todo-list').addEventListener('click', function(event) {
    // Stopp der Weiterleitung
    event.preventDefault();
    
    // Prüfen, ob das geklickte Element ein Listenelement ist
    if (event.target && event.target.nodeName === 'LI') {
        // Zeige das Popup an und übergebe die ID des Todos
        showPopup(event.target.id);
    }
});

// Eventlistener für das Klicken auf die "Entfernen"-Schaltfläche im Popup hinzufügen
document.getElementById('remove-btn').addEventListener('click', function() {
    // Extrahiere die ID des geklickten Todos aus dem Popup
    const todoId = document.getElementById('popup-content').dataset.todoId;
    // Entferne das Todo mit der entsprechenden ID
    removeTodoFromPopup(todoId);
    hidePopup(); // Popup ausblenden
});

// Funktion zum Entfernen eines Todos aus dem Popup
function removeTodoFromPopup(todoId) {
    // Die ID des Todos sollte bereits in der Form 'todo-x' vorliegen, wobei 'x' die Todo-ID ist
    // Entferne daher den Teil 'todo-' und behalte nur die ID
    const todoIdNumber = todoId.replace('todo-', '');
    // Rufe die removeTodo-Funktion auf und übergebe die korrekte ID des Todos
    removeTodo(todoIdNumber);
}