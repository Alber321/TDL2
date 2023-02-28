//PWA offline
navigator.serviceWorker.register('./ServiceWorker.js');

const firebaseConfig = {
  apiKey: "AIzaSyDwdTqpayDSETEypr2aCq20G9DOgGtBd78",
  authDomain: "todolist-47aff.firebaseapp.com",
  projectId: "todolist-47aff",
  storageBucket: "todolist-47aff.appspot.com",
  messagingSenderId: "508008619572",
  appId: "1:508008619572:web:43d1634d45584f6c753461",
  measurementId: "G-WGDG9NR4ZM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

const listaTareas = document.getElementById('lista-tareas');
const nuevaTarea = document.getElementById('nueva-tarea');

function addTask(event) {
  event.preventDefault();
  const taskText = nuevaTarea.value;
  if (taskText !== '') {
    db.collection("tareas").add({
      tarea: taskText,
      estado: false,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    }).then((docRef) => {

    const taskItem = document.createElement('li');
    taskItem.dataset.id = docRef.id;
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
  }).catch(error => {
      console.error('Error al agregar la tarea:', error);
    });
  }
}
document.querySelector('form').addEventListener('submit', addTask);

function completeTask(event) {
  const taskItem = event.target.parentNode;
  const id = taskItem.dataset.id;
  const estado = taskItem.classList.toggle('completed');
  db.collection('tareas').doc(id).update({ estado })
    .catch(error => {
      console.error('Error al completar la tarea:', error);
    });
}

function deleteTask(event) {
  const taskItem = event.target.parentNode;
  const id = taskItem.dataset.id;
  db.collection('tareas').doc(id).delete()
    .catch(error => {
      console.error('Error al eliminar la tarea:', error);
    });
  listaTareas.removeChild(taskItem);
  }