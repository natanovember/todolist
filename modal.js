document.addEventListener("DOMContentLoaded", ready);

function ready(){
  refreshToDoList();
}

let modal = document.getElementById("myModal");

let button = document.getElementById("modal-button");

let editButton = document.getElementById("edit");

let close = document.getElementsByClassName("close")[0];

let closeButton = document.getElementsByClassName('close-button')[0];

let add = document.getElementById('add');

let todo = document.getElementById('to-do-item');



button.onclick = function() {
  modal.style.display = "block";
}

function doEdit() {
  modal.style.display = "block";

}
function markAsDone(id) {
  localStorage.setItem('toDoListInputs', JSON.stringify(getTaskListFromLocalStorage().map(item => {
    if (item.id === id){
        return {
            ...item,
            done: !item.done
        };
    }
    return item;
})));
refreshToDoList();
}





function addControlEventListeners(){
  document.querySelector('.control').onclick = function(e) {
      if (e.target) {
          if (e.target.matches(".addNewButton")) {
              show_AddNew_Modal();
          } else if(e.target.matches(".deleteAllButton")){
              deleteAll();
              refreshToDoList();
          } else if(e.target.matches(".searchBtn")){
              refreshToDoList();
          }
      }
  }
  document.querySelector('.search').addEventListener('input', function(event) {
      refreshToDoList();
  });
}





function deleteTask(id) {
  console.log("delete " + id);
  
  localStorage.setItem('toDoListInputs', JSON.stringify(getTaskListFromLocalStorage().filter(task => task.id !== id )));
  refreshToDoList();

}
close.onclick = function() {
  modal.style.display = "none";
}

closeButton.onclick = function() {
    modal.style.display = "none";
}

 
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function deleteAll() {
    localStorage.clear();
    refreshToDoList();
}

function renderTask(task){
  if(task.done){
    return `
  <div id="to-do-item" class="todolist done">
                              <p>Name: ${task.name}</p>
                              <p>Description: ${task.description}</p>
                              <p>Priority: ${task.priority}</p>
                              <p>Date: ${task.date}</p>
                              <button id="delete" onclick="deleteTask('${task.id}')">Delete</button>
                              <button id="edit" onclick="doEdit('${task.id}')">Edit</button>
                              <button id="done" onclick="markAsDone('${task.id}')">Mark as undone</button>
                            </div>`

  }
  return `
  <div id="to-do-item" class="todolist">
                              <p>Name: ${task.name}</p>
                              <p>Description: ${task.description}</p>
                              <p>Priority: ${task.priority}</p>
                              <p>Date: ${task.date}</p>
                              <button id="delete" onclick="deleteTask('${task.id}')">Delete</button>
                              <button id="edit" onclick="doEdit('${task.id}')">Edit</button>
                              <button id="done" onclick="markAsDone('${task.id}')">Mark as done</button>
                            </div>`
}

function getTaskListFromLocalStorage(){
  return JSON.parse(localStorage.getItem('toDoListInputs')) || [];
}
function addToLocalStorage(task){
  let saved = JSON.parse(localStorage.getItem('toDoListInputs')) || [];
  saved.push(task);
  localStorage.setItem('toDoListInputs', JSON.stringify(saved));
}

function refreshToDoList(){
  let todolist = document.querySelector(".todolist");
  todolist.innerHTML = '';
  let saved = JSON.parse(localStorage.getItem('toDoListInputs')) || [];
    saved = saved.sort((a, b) => {
        if (a.done == b.done){
            if (priorityToValue(a.priority) > priorityToValue(b.priority)){
                return -1;
            } else {
                return 1;
            }
        } else if(a.done > b.done){
            return 1;
        } else {
            return -1;
        }
    });

    let searchVal = document.querySelector('.search').value;
    if (searchVal){
        saved = saved.filter(a => ((a.name.includes(searchVal)) || (a.description.includes(searchVal))));
    }

  saved.forEach(function(element) {
    todolist.innerHTML += renderTask(element);
  });

    function priorityToValue(priority) {
        if(priority === "low"){
            return 0;
        } else if(priority === "middle"){
            return 1;
        } else {
            return 2;
        }
    }
}

// Get form, item, and wishlist
let addToDoList = document.getElementById("myModal");
let toDoListName = document.getElementById("name");
let toDoListDes = document.getElementById("description");
let toDoListPrior = document.getElementById("priority");
let toDoListDate = document.getElementById("date");
let toDoList = document.getElementById("to-do-list");

addToDoList.addEventListener('submit', function (event) {

    // Don't submit the form
    event.preventDefault();

    // Ignore it if the wishlist item is empty
    if (toDoListName.value.length < 1) return;
    if (toDoListPrior.value.length < 1) return;
    
    addToLocalStorage({
      id: (new Date).toISOString(),
      name: toDoListName.value,
      description: toDoListDes.value,
      priority: toDoListPrior.value,
      date : toDoListDate.value,
      done: false
    });
    
    // Clear input
    toDoListName.value = '';
    toDoListDes.value = '';
    toDoListPrior.value = '';
    toDoListDate.value = '';
    modal.style.display = "none";

    refreshToDoList();
}, false);


var saved = localStorage.getItem('toDoListInputs');

// If there are any saved items, update our list
if (saved) {
    toDoList.innerHTML = saved;
}