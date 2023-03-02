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
  
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.firestore();
  
  const listaTareas = document.getElementById('lista-tareas');
  const nuevaTarea = document.getElementById('nueva-tarea');
  
  // Comprobar si el usuario está online y sincronizar la lista de tareas
  if (navigator.onLine) {
    db.collection("tareas").orderBy('timestamp', "asc").onSnapshot(querySnapshot => {
      listaTareas.innerHTML = '';
      localStorage.clear();
      
      querySnapshot.forEach(doc => {
        const task = doc.data();
        const taskItem = document.createElement('li');
        taskItem.dataset.id = doc.id;
        taskItem.innerText = task.tarea;
  
        const completeButton = document.createElement('button');
        completeButton.innerText = '?';
        // completeButton.classList.add("eliminar")
        completeButton.addEventListener('click', completeTask);
  
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';
        // deleteButton.classList.add("eliminar")
        deleteButton.addEventListener('click', deleteTask);
  
        if (task.estado) {
          taskItem.classList.add('completed');
        }
  
        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        listaTareas.appendChild(taskItem);

        nuevaTarea.value = '';
  
        // Guardar tarea en localStorage
        localStorage.setItem(doc.id, JSON.stringify(task));
      });
    });
  } else {
    // Mostrar tareas guardadas en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const task = JSON.parse(localStorage.getItem(key));
      const taskItem = document.createElement('li');
      taskItem.dataset.id = key;
      taskItem.innerText = task.tarea;
  
      const completeButton = document.createElement('button');
      completeButton.innerText = '?';
      completeButton.addEventListener('click', completeTask);
  
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'X';
      deleteButton.addEventListener('click', deleteTask);
  
      if (task.estado) {
        taskItem.classList.add('completed');
      }
  
      taskItem.appendChild(completeButton);
      taskItem.appendChild(deleteButton);
      listaTareas.appendChild(taskItem);
      nuevaTarea.value = '';
    }
  }
  
  function addTask(event) {
    event.preventDefault();
    const taskText = nuevaTarea.value;
    if (taskText !== '') {
      db.collection("tareas").add({
        tarea: taskText,
        estado: false,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
      })
        
      .catch(error => {
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