const $todoForm = document.querySelector('.todo-form');
const $todoInput = document.querySelector('.todo-input');
const $tasksList = document.querySelector('.tasks-list');

let tasks = [];

function createTask(taskObject) {
  const $taskItem = document.createElement('li');
  const $taskText = document.createElement('span');

  $taskItem.classList.add('task-item');
  $taskText.classList.add('task-text');

  $taskText.innerText = taskObject.value;

  $taskItem.appendChild($taskText);

  createDefaultButtonsSet();

  $taskItem.setAttribute('data-id', taskObject.id);
  $taskItem.appendChild(createDefaultButtonsSet());

  if (taskObject.complited) {
    $taskText.classList.add('task-done-text');
  }

  return $taskItem;
}

function createDefaultButtonsSet() {
  const $taskBtnHolder = document.createElement('div');
  const $taskDone = document.createElement('button');
  const $taskRemove = document.createElement('button');
  const $taskEdit = document.createElement('button');

  $taskDone.classList.add('task-btn', 'btn-done');
  $taskRemove.classList.add('task-btn', 'btn-remove');
  $taskEdit.classList.add('task-btn', 'btn-edit');
  $taskBtnHolder.classList.add('task-btn-holder');

  $taskDone.innerText = 'Done';
  $taskRemove.innerText = 'Remove';
  $taskEdit.innerText = 'Edit';

  $taskBtnHolder.appendChild($taskDone);
  $taskBtnHolder.appendChild($taskRemove);
  $taskBtnHolder.appendChild($taskEdit);

  return $taskBtnHolder;
}

function createEditButtonsSet() {
  const $taskBtnHolder = document.createElement('div');
  const $taskSave = document.createElement('button');
  const $taskCancel = document.createElement('button');

  $taskBtnHolder.classList.add('task-btn-holder');
  $taskSave.classList.add('task-btn', 'btn-save');
  $taskCancel.classList.add('task-btn', 'btn-cancel');

  $taskSave.innerText = 'Save';
  $taskCancel.innerText = 'Cancel';

  $taskBtnHolder.appendChild($taskSave);
  $taskBtnHolder.appendChild($taskCancel);

  return $taskBtnHolder;
}

function generateId() {
  let id = (String(new Date)
    .slice(16,24) + ':' + String((new Date)
    .getMilliseconds()))
    .replace(/:/g, '');
  return id;
}

$todoForm.addEventListener('submit', e => {
  e.preventDefault();

  if ($todoInput.value.trim()) {
    const task = {
      value: $todoInput.value,
      complited: false,
      id: generateId()
    }

    tasks.unshift(task);
    $tasksList.prepend(createTask(task));
  }

  $todoInput.value = '';
});

$tasksList.addEventListener('click', e => {
  const element = e.target;
  const targetClassList = element.classList;

  let currentId;

  if (targetClassList.contains('btn-done') || targetClassList.contains('btn-remove') || targetClassList.contains('btn-edit')) {
    currentId = element.closest('.task-item').getAttribute('data-id');
  }

  if (targetClassList.contains('btn-done')) {
    document.querySelector('.btn-done').disabled = true;
    tasks.find(task => task.id === currentId).complited = true;

    $tasksList.innerHTML = '';

    tasks.forEach(task => {
      $tasksList.append(createTask(task));
    });
  } else if (targetClassList.contains('btn-remove')) {
    $tasksList.innerHTML = '';

    tasks = tasks.filter(task => task.id !== currentId);
     
    tasks.forEach(task => {
      $tasksList.append(createTask(task));
    });
  } else if (targetClassList.contains('btn-edit')) {
    const $taskInput = document.createElement('input');
    const $taskItem = element.closest('.task-item');
    const targetID = $taskItem.getAttribute('data-id');

    $taskInput.classList.add('task-text-edit');
    $taskInput.setAttribute('type', 'text');

    const taskText = $taskItem.querySelector('.task-text').innerText;
    $taskInput.value = taskText;

    $taskItem.innerHTML = '';

    $taskItem.appendChild($taskInput);
    $taskItem.appendChild(createEditButtonsSet());

    $taskInput.focus();

    $tasksList.addEventListener('click', e => {
      const element = e.target;
      const targetClassList = element.classList;

      if (targetClassList.contains('btn-save')) {
        const inputText = $taskInput.value;

        tasks.forEach(item => {
          if (item.id === targetID) {
            item.value = inputText;
          }
        });

        $taskItem.innerHTML = '';

        const $taskText = document.createElement('span');
      
        $taskItem.classList.add('task-item');
        $taskText.classList.add('task-text');

        $taskText.innerText = inputText;
      
        $taskItem.appendChild($taskText);
        $taskItem.appendChild(createDefaultButtonsSet());
      } else if (targetClassList.contains('btn-cancel')) {
        $taskItem.innerHTML = '';

        const $taskText = document.createElement('span');
      
        $taskItem.classList.add('task-item');
        $taskText.classList.add('task-text');
      
        $taskText.innerText = taskText;
      
        $taskItem.appendChild($taskText);
        $taskItem.appendChild(createDefaultButtonsSet());
      }
    });
  }
});