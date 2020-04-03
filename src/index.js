const $todoForm = document.querySelector('.todo-form');
const $todoInput = document.querySelector('.todo-input');
const $tasksList = document.querySelector('.tasks-list');

let tasks = [];

function createTask(taskObject) {
  const $taskItem = document.createElement('li');
  const $taskText = document.createElement('span');
  const $taskBtnHolder = document.createElement('div');
  const $taskDone = document.createElement('button');
  const $taskEdit = document.createElement('button');
  const $taskRemove = document.createElement('button');

  $taskItem.classList.add('task-item');
  $taskText.classList.add('task-text');
  $taskDone.classList.add('task-btn', 'btn-done');
  $taskRemove.classList.add('task-btn', 'btn-remove');
  $taskEdit.classList.add('task-btn', 'btn-edit');
  $taskBtnHolder.classList.add('task-btn-holder');

  $taskText.innerText = taskObject.value;
  $taskDone.innerText = 'Done';
  $taskEdit.innerText = 'Edit';
  $taskRemove.innerText = 'Remove';

  $taskItem.appendChild($taskText);
  $taskBtnHolder.appendChild($taskDone);
  $taskBtnHolder.appendChild($taskEdit);
  $taskBtnHolder.appendChild($taskRemove);

  $taskItem.setAttribute('data-id', taskObject.id);
  $taskItem.appendChild($taskBtnHolder);

  if (taskObject.complited) {
    $taskText.classList.add('task-done-text');
  }

  return $taskItem;
}

function createEdition(elementObject) {
  const $taskInput = document.createElement('input');
  const $taskItem = elementObject.closest('.task-item');
  const $taskBtnHolder = $taskItem.querySelector('.task-btn-holder');

  $taskInput.classList.add('task-text-edit');
  $taskInput.setAttribute('type', 'text');

  const taskText = $taskItem.querySelector('.task-text').innerText;
  $taskInput.value = taskText;

  $taskItem.querySelector('.task-text').hidden = true;
  $taskItem.querySelector('.btn-done').hidden = true;
  $taskItem.querySelector('.btn-edit').hidden = true;
  $taskItem.querySelector('.btn-remove').hidden = true;

  $taskItem.prepend($taskInput);

  $taskInput.focus();

  const $taskSave = document.createElement('button');
  const $taskCancel = document.createElement('button');

  $taskSave.classList.add('task-btn', 'btn-save');
  $taskCancel.classList.add('task-btn', 'btn-cancel');

  $taskSave.innerText = 'Save';
  $taskCancel.innerText = 'Cancel';

  $taskBtnHolder.appendChild($taskSave);
  $taskBtnHolder.appendChild($taskCancel);
}

function removeEdition(elementObject) {
  elementObject.querySelector('.task-text-edit').remove();
  elementObject.querySelector('.btn-save').remove();
  elementObject.querySelector('.btn-cancel').remove();
}

function showButtons(elementObject) {
  elementObject.querySelector('.task-text').hidden = false;
  elementObject.querySelector('.btn-done').hidden = false;
  elementObject.querySelector('.btn-edit').hidden = false;
  elementObject.querySelector('.btn-remove').hidden = false;
}

function generateId() {
  const dateStart = 16;
  const dateEnd = 24;
  const id = (String(new Date()).slice(dateStart, dateEnd) + ':' + String(new Date().getMilliseconds())).replace(
    /:/g,
    ''
  );
  return id;
}

$todoForm.addEventListener('submit', e => {
  e.preventDefault();

  if ($todoInput.value.trim()) {
    const task = {
      value: $todoInput.value,
      complited: false,
      id: generateId(),
    };

    tasks.unshift(task);
    $tasksList.prepend(createTask(task));
  }

  $todoInput.value = '';
});

$todoForm.addEventListener('submit', e => {
  e.preventDefault();

  if ($todoInput.value.trim()) {
    const task = {
      value: $todoInput.value,
      complited: false,
      id: generateId(),
    };

    tasks.unshift(task);
    $tasksList.prepend(createTask(task));
  }

  $todoInput.value = '';
});

$tasksList.addEventListener('click', baseEvent => {
  const element = baseEvent.target;
  const targetClassList = element.classList;

  let currentId;

  const btnClass = ['btn-done', 'btn-remove', 'btn-edit'];

  btnClass.forEach(elem => {
    if (targetClassList.contains(elem)) {
      currentId = element.closest('.task-item').getAttribute('data-id');
    }
  });

  if (targetClassList.contains('btn-done')) {
    tasks.find(task => task.id === currentId).complited = true;

    element
      .closest('.task-item')
      .querySelector('.task-text')
      .classList.add('task-done-text');

    element.disabled = true;

    element.closest('.task-btn-holder').querySelector('.btn-edit').disabled = true;
  } else if (targetClassList.contains('btn-remove')) {
    $tasksList.innerHTML = '';

    tasks = tasks.filter(task => task.id !== currentId);

    tasks.forEach(task => $tasksList.append(createTask(task)));
  } else if (targetClassList.contains('btn-edit')) {
    createEdition(element);
  }
});

$tasksList.addEventListener('click', editEvent => {
  const element = editEvent.target;
  const $taskItem = element.closest('.task-item');
  const targetID = $taskItem.getAttribute('data-id');
  const editElement = editEvent.target;
  const editTargetClassList = editElement.classList;

  if (editTargetClassList.contains('btn-save')) {
    const inputText = $tasksList.querySelector('.task-text-edit').value;
    $tasksList.querySelector('.task-text').innerText = inputText;

    tasks.forEach(item => {
      if (item.id === targetID) {
        item.value = inputText;
      }
    });

    removeEdition($taskItem);
    showButtons($taskItem);
  } else if (editTargetClassList.contains('btn-cancel')) {
    removeEdition($taskItem);
    showButtons($taskItem);
  }
});

// после первого клика, второй клик в событии уже сразу на два
