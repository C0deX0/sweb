class TodoMainClass {

    async getAllTodos ()
    {
        let url = 'index.php/todoAjax?action=getTodos&param=all';
        let response = await fetch(url);

        if (response.ok) {
            return await response.json();
        } else {
            console.log('HTTP-Error: ' + response.status);
        }
    }

    async getFinishedTodos ()
    {
        let url = 'index.php/todoAjax?action=getTodos&param=finished';
        let response = await fetch(url);

        if (response.ok) {
            return await response.json();
        } else {
            console.log('HTTP-Error: ' + response.status);
        }
    }

    async showTodos (getTodos)
    {
        document.getElementById('allTodos').innerHTML = '';

        let todoObject;
        if ('finished' === getTodos) {
            todoObject = await this.getFinishedTodos();
        } else {
            todoObject = await this.getAllTodos();
        }

        for (let objectNumber in todoObject) {
            let alertDiv = document.createElement('div');

            let alertClose = '<button type="button" class="close ml-3" style="color: red" onclick="confirmAlert(' + todoObject[objectNumber]['id'] + ', \'delete\')"><i class="fas fa-times"></i></button>';
            let alertFinish = '<button type="button" class="close ml-3" style="color: green" onclick="confirmAlert(' + todoObject[objectNumber]['id'] + ', \'finish\')"><i class="fas fa-check"></i></button>';
            let alertEdit = '<button type="button" class="close" style="color: blue" onclick="confirmAlert(' + todoObject[objectNumber]['id'] + ', \'edit\')"><i class="fas fa-pencil-alt"></i></button>';
            let alertTitle = '<h4 class="alert-heading">' + todoObject[objectNumber]['title'] + '</h4>';
            let alertText = '<p>' + todoObject[objectNumber]['text'] + '</p>';

            alertDiv.id = 'todo_' + todoObject[objectNumber]['id'];
            alertDiv.className = 'alert alert-' + todoObject[objectNumber]['color'] + ' fade show';
            alertDiv.role = 'alert';
            alertDiv.insertAdjacentHTML('beforeend', alertClose);
            alertDiv.insertAdjacentHTML('beforeend', alertFinish);
            alertDiv.insertAdjacentHTML('beforeend', alertEdit);
            alertDiv.insertAdjacentHTML('beforeend', alertTitle);
            alertDiv.insertAdjacentHTML('beforeend', alertText);
            document.getElementById('allTodos').append(alertDiv);
        }
    }





    // TODO: TEST Request
    async getReq ()
    {
        let url = 'index.php/todoAjax?action=getTodos&param=all';
        let response = await fetch(url);

        if (response.ok) {
            let json = await response.json();
            console.log(json);
        } else {
            console.log('HTTP-Error: ' + response.status);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let todoMain = new TodoMainClass();

    todoMain.showTodos('all');
    //todoMain.getReq();

});

/*

async function getAllTodos() {
    let defaultMain = new Main();
    let todos = await defaultMain.getAllAjaxRequest('?module=todo&action=getTodo&param=all');
    showTodo(todos, 'allTodos');
}

async function showFinished() {
    let defaultMain = new Main();
    let todos = await defaultMain.getAllAjaxRequest('?module=todo&action=getTodo&param=finished');
    showTodo(todos, 'allTodos');
}

function showTodo (todoObject, element)
{
    document.getElementById(element).innerHTML = '';

    for (objectNumber in todoObject) {
        let alertDiv = document.createElement('div');

        let alertClose = '<button type="button" class="close ml-3" style="color: red" onclick="confirmAlert(' + todoObject[objectNumber]['id'] + ', \'delete\')"><i class="fas fa-times"></i></button>';
        let alertFinish = '<button type="button" class="close ml-3" style="color: green" onclick="confirmAlert(' + todoObject[objectNumber]['id'] + ', \'finish\')"><i class="fas fa-check"></i></button>';
        let alertEdit = '<button type="button" class="close" style="color: blue" onclick="confirmAlert(' + todoObject[objectNumber]['id'] + ', \'edit\')"><i class="fas fa-pencil-alt"></i></button>';
        let alertTitle = '<h4 class="alert-heading">' + todoObject[objectNumber]['title'] + '</h4>';
        let alertText = '<p>' + todoObject[objectNumber]['text'] + '</p>';

        alertDiv.id = 'todo_' + todoObject[objectNumber]['id'];
        alertDiv.className = 'alert alert-' + todoObject[objectNumber]['color'] + ' fade show';
        alertDiv.role = 'alert';
        alertDiv.insertAdjacentHTML('beforeend', alertClose);
        alertDiv.insertAdjacentHTML('beforeend', alertFinish);
        alertDiv.insertAdjacentHTML('beforeend', alertEdit);
        alertDiv.insertAdjacentHTML('beforeend', alertTitle);
        alertDiv.insertAdjacentHTML('beforeend', alertText);
        document.getElementById(element).append(alertDiv);
    }
}

function createTodo ()
{
    document.getElementById('todoActions').innerHTML = '';
    let createForm = document.createElement('form');
    createForm.id = 'todoForm';

    let createHeader = '<h4><u>Create Todo</u></h4>';
    let formGroupTitle = '<div class="form-group"><label for="todoTitle">Title:</label><input type="text" class="form-control" id="todoTitle" name="todoTitle" placeholder="Title"></div>';
    let formGroupText = '<div class="form-group"><label for="todoText">Text:</label><textarea class="form-control" id="todoText" name="todoText" placeholder="Text"></textarea></div>';
    let formGroupSelect = '<div class="form-group">' +
        '<label for="todoColor">Select color:</label>' +
        '<select class="form-control w-50" id="todoColor" name="todoColor" onchange="setCurrentColor(this);">' +
        '<option value="change">-- choose --</option>' +
        '<option class="bg-primary text-white" value="primary" style="">Dark blue</option>' +
        '<option class="bg-secondary text-white" value="secondary">Gray</option>' +
        '<option class="bg-success text-white" value="success">Green</option>' +
        '<option class="bg-danger text-white" value="danger">Red</option>' +
        '<option class="bg-warning text-white" value="warning">Yellow</option>' +
        '<option class="bg-info text-white" value="info">Light blue</option>' +
        '</select>';
    let saveButton = '<button type="submit" class="btn btn-primary" onclick="saveTodo();">Save</button>';

    createForm.insertAdjacentHTML('beforeend', createHeader);
    createForm.insertAdjacentHTML('beforeend', formGroupTitle);
    createForm.insertAdjacentHTML('beforeend', formGroupText);
    createForm.insertAdjacentHTML('beforeend', formGroupSelect);
    createForm.insertAdjacentHTML('beforeend', saveButton);


    document.getElementById('todoActions').append(createForm);
}

function saveTodo ()
{
    todoForm.onsubmit = async (e) => {
        e.preventDefault();

        await fetch('src/Controller.php?module=todo&action=saveTodo&param=insert', {
            method: 'POST',
            body: new FormData(todoForm)
        });

        getAllTodos();
        createTodo();
    };
}

function finishTodo (todoId)
{
    let url = 'src/Controller.php?module=todo&action=finishTodo&param=' + todoId;
    fetch(url)
        .then(respone => getAllTodos());
}

function deleteTodo (todoId)
{
    let url = 'src/Controller.php?module=todo&action=deleteTodo&param=' + todoId;
    fetch(url)
        .then(respone => getAllTodos());

}

function confirmAlert (todoId, action)
{
    if (action === 'edit') {

        let todoElement = document.getElementById('todo_' + todoId);
        let todoTitle = todoElement.getElementsByTagName('h4')[0].textContent;

        document.getElementById('infoModalHeader').innerText = 'Edit Todo?';
        document.getElementById('infoModalBody').innerHTML = 'Todo "<u>' + todoTitle + '</u>" bearbeiten?';
        let modalSubmitButton = document.getElementById('infoModalSubmitButton');
        modalSubmitButton.setAttribute('onclick', '');
        $('#infoModal').modal('toggle');

    } else if (action === 'finish') {

        let todoElement = document.getElementById('todo_' + todoId);
        let todoTitle = todoElement.getElementsByTagName('h4')[0].textContent;

        document.getElementById('infoModalHeader').innerText = 'Finish Todo?';
        document.getElementById('infoModalBody').innerHTML = 'Todo "<u>' + todoTitle + '</u>" auf erledigt setzen?';
        let modalSubmitButton = document.getElementById('infoModalSubmitButton');
        modalSubmitButton.setAttribute('onclick', 'finishTodo(' + todoId + ');');
        $('#infoModal').modal('toggle');

    } else if (action === 'delete') {

        let todoElement = document.getElementById('todo_' + todoId);
        let todoTitle = todoElement.getElementsByTagName('h4')[0].textContent;

        document.getElementById('infoModalHeader').innerText = 'Delete Todo?';
        document.getElementById('infoModalBody').innerHTML = 'Wollen sie wirklich todo mit dem Titel "<u>' + todoTitle + '</u>" löschen?';
        let modalSubmitButton = document.getElementById('infoModalSubmitButton');
        modalSubmitButton.setAttribute('onclick', 'deleteTodo(' + todoId + ');');
        $('#infoModal').modal('toggle');
    }
}

function setCurrentColor(element)
{
    let elementValue = element.value;

    element.classList.forEach(className => {
        if (className.startsWith('bg-')) {
            element.classList.remove(className)
        }
    });

    if (elementValue !== 'change') {
        element.classList.add('bg-' + elementValue);
        element.classList.add('text-white');
    } else {
        element.classList.remove('text-white');
    }
}

function editTodo() {
    //TODO edit Todo function
    //TODO edit Todo function
    //TODO edit Todo function
    //TODO edit Todo function
    //TODO edit Todo function
    //TODO edit Todo function
}*/
