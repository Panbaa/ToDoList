function getTodos() {
  fetch("/todos")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const todoList = document.getElementById("todo-list");
      todoList.innerHTML = "";
      data.forEach((todo) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        const deletebox = document.createElement("button");
        deletebox.classList.add("todo-delete");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-check");
        checkbox.checked = todo.completed;
        const text = document.createElement("span");
        text.textContent = todo.content;
        text.id = `text-todo-${todo.id}`;

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deletebox);

        li.classList.add("todo-item");
        li.id = todo.id;
        todoList.appendChild(li);
        if (todo.completed) {
          document
            .getElementById(`text-todo-${todo.id}`)
            .style.setProperty("text-decoration", "line-through");
        }
      });
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Todos:", error);
    });
}

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
      getTodos();
    }
  });
}

function removeTodo(todoId) {
  fetch(`/todos/${todoId}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      getTodos();
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
    `Todo Nr. ${todoId} got updated with Content: ${content} and Bool: ${completed}!`
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
      return "";
    });
}
function getBool(todoId) {
  return fetch(`/todos/${todoId}`, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network respnse was not ok");
      }
      return response.json();
    })
    .then((todo) => {
      return todo.completed;
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen des Todos:", error);
      return "";
    });
}

function showPopup(todoId) {
  const popupOverlay = document.getElementById("popup-overlay");
  const popupContent = document.getElementById("popup-content");
  popupOverlay.style.display = "block";
  popupContent.dataset.todoId = todoId;
}

function hidePopup() {
  const popupOverlay = document.getElementById("popup-overlay");
  popupOverlay.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  getTodos();
});

document.getElementById("add-todo-btn").addEventListener("click", addTodo);

document
  .getElementById("todo-list")
  .addEventListener("click", function (event) {
    event.preventDefault();

    if (event.target && event.target.className.includes("todo-check")) {
      // console.log(`checkbox of LI-${event.target.parentNode.id} was pressed`);
      switchDoneState(event.target.parentNode.id);
    }
    if (event.target && event.target.id.includes("text-todo-")) {
      console.log(`Todo ${event.target.parentNode.id} should have poped up!`);
    }
    if (event.target && event.target.className.includes("todo-delete")) {
      // console.log(`Todo ${event.target.parentNode.id} should have been deleted!`);
      removeTodo(event.target.parentNode.id);
    }
  });

function switchDoneState(todoId) {
  getContent(todoId).then((content) => {
    getBool(todoId).then((bool) => {
      updateTodo(todoId, content, !bool);
    })
  });
}

const inputField = document.getElementById("todo-input");
const submitButton = document.getElementById("add-todo-btn");

inputField.addEventListener('keydown', function(event){
  if(event.key === 'Enter'){
    submitButton.click();
  }
})