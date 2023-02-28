//PWA offline
navigator.serviceWorker.register('./ServiceWorker.js');

const listaTareas = document.getElementById('lista-tareas');
const nuevaTarea = document.getElementById('nueva-tarea');

function addTask(event) {
  event.preventDefault();
  const taskText = nuevaTarea.value;
  if (taskText !== '') {
    const taskItem = document.createElement('li');
    taskItem.innerText = taskText;

    const completeButton = document.createElement('button');
    completeButton.innerText = '✔';
    completeButton.addEventListener('click', completeTask);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'X';
    deleteButton.addEventListener('click', deleteTask);
    
    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);
    listaTareas.appendChild(taskItem);
    nuevaTarea.value = '';
  }
}
document.querySelector('form').addEventListener('submit', addTask);

function completeTask(event) {
    const taskItem = event.target.parentNode;
    taskItem.classList.toggle('completed');
  }

  function deleteTask(event) {
    const taskItem = event.target.parentNode;
    listaTareas.removeChild(taskItem);
  }