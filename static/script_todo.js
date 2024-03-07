function getTodos() {
    fetch("/todos")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";
        data.forEach((todo) => {
          const li = document.createElement("li");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList.add("todo-check");
          checkbox.checked = todo.completed;
          li.appendChild(checkbox);
  
          const text = document.createTextNode(todo.content);
          li.appendChild(text);
  
          li.classList.add("todo-item");
          li.id = todo.id;
          todoList.appendChild(li);
          if(todo.completed){
            document.getElementById(todo.id).style.setProperty("text-decoration", "line-through")
          }
        });
      })
      .catch(error => {
        console.error('Fehler beim Abrufen der Todos:', error);
      });
  }

// Funktion zum Hinzufügen eines Todos
function addTodo() {
  const input = document.getElementById("todo-input");
  const content = input.value;
  fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: content }),
  }).then((response) => {
    if (response.ok) {
      input.value = "";
      getTodos(); // Aktualisiere die Todo-Liste nach dem Hinzufügen
    }
  });
}

// Funktion zum Entfernen eines Todos
function removeTodo(todoId) {
  fetch(`/todos/${todoId}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      getTodos(); // Aktualisiere die Todo-Liste nach dem Entfernen
    }
  });
}

function updateTodo(todoId, content, completed) {
  fetch(`/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content,
      completed: completed,
    }),
  }).then((response) => {
    if (response.ok) {
      getTodos();
    }
  });
  console.log(
    `todo ${todoId} wurde mit dem Content: ${content} und dem Bool: ${completed} updated!`
  );
}

function getContent(todoId) {
  return fetch(`/todos/${todoId}`, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((todo) => {
      return todo.content;
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen des Todos:", error);
      return ""; // Rückgabe eines leeren Strings im Fehlerfall
    });
}

// Funktion zum Anzeigen des Popups
function showPopup(todoId) {
  const popupOverlay = document.getElementById("popup-overlay");
  const popupContent = document.getElementById("popup-content");
  popupOverlay.style.display = "block";
  popupContent.dataset.todoId = todoId; // Speichere die ID des Todos im Popup
}

// Funktion zum Ausblenden des Popups
function hidePopup() {
  const popupOverlay = document.getElementById("popup-overlay");
  popupOverlay.style.display = "none";
}

// Beim Laden der Seite die Todos abrufen und anzeigen
document.addEventListener("DOMContentLoaded", function () {
  getTodos();
});

// Eventlistener für das Klicken auf die "Add Todo"-Schaltfläche hinzufügen
document.getElementById("add-todo-btn").addEventListener("click", addTodo);

// Eventlistener für das Klicken auf ein Listenelement hinzufügen
document
  .getElementById("todo-list")
  .addEventListener("click", function (event) {
    // Stopp der Weiterleitung
    event.preventDefault();

    // Prüfen, ob das geklickte Element ein Listenelement ist
    if (event.target && event.target.nodeName === "LI") {
      // Zeige das Popup an und übergebe die ID des Todos
      showPopup(event.target.id);
    }
  });

// Eventlistener für das Klicken auf die "Entfernen"-Schaltfläche im Popup hinzufügen
document.getElementById("remove-btn").addEventListener("click", function () {
  // Extrahiere die ID des geklickten Todos aus dem Popup
  const todoId = document.getElementById("popup-content").dataset.todoId;
  // Entferne das Todo mit der entsprechenden ID
  removeTodo(todoId);
  hidePopup(); // Popup ausblenden
});

document
  .getElementById("mark-complete-btn")
  .addEventListener("click", function () {
    const todoId = document.getElementById("popup-content").dataset.todoId;
    markAsDone(todoId);
    hidePopup();
  });

function markAsDone(todoId) {
    getContent(todoId).then(content => {
        updateTodo(todoId, content, true);
    })
}