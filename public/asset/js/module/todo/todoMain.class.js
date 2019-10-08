class TodoMainClass {

    async jsonCallToController (requestParameter)
    {
        let response = await fetch(requestParameter);

        if (response.ok) {
            return await response.json();
        } else {
            console.log('HTTP-Error: ' + response.status);
        }
    }

    async getAllTodos ()
    {
        const url = 'index.php/todoAjax?action=getTodos&fetchType=all';
        this.showTodos(await this.jsonCallToController(url));
    }

    async getFinishedTodos ()
    {
        const url = 'index.php/todoAjax?action=getTodos&fetchType=finished';
        this.showTodos(await this.jsonCallToController(url));
    }

    showTodos (todoObject)
    {
        document.getElementById('allTodos').innerHTML = '';

        for (let objectNumber in todoObject) {
            const alertDiv = document.createElement('div');

            const alertClose = '<button type="button" class="close ml-3" style="color: red" onclick="todoClass.confirmAlert(' + todoObject[objectNumber]['id'] + ', \'delete\')"><i class="fas fa-times"></i></button>';
            const alertFinish = '<button type="button" class="close ml-3" style="color: green" onclick="todoClass.confirmAlert(' + todoObject[objectNumber]['id'] + ', \'finish\')"><i class="fas fa-check"></i></button>';
            const alertEdit = '<button type="button" class="close" style="color: blue" onclick="todoClass.confirmAlert(' + todoObject[objectNumber]['id'] + ', \'edit\')"><i class="fas fa-pencil-alt"></i></button>';
            const alertTitle = '<h4 class="alert-heading">' + todoObject[objectNumber]['title'] + '</h4>';
            const alertText = '<p>' + todoObject[objectNumber]['text'] + '</p>';

            alertDiv.id = 'todo_' + todoObject[objectNumber]['id'];
            alertDiv.className = 'alert alert-' + todoObject[objectNumber]['color'] + ' fade show';
            alertDiv.setAttribute('role', 'alert');
            alertDiv.setAttribute('name', todoObject[objectNumber]['color']);
            alertDiv.insertAdjacentHTML('beforeend', alertClose);
            alertDiv.insertAdjacentHTML('beforeend', alertFinish);
            alertDiv.insertAdjacentHTML('beforeend', alertEdit);
            alertDiv.insertAdjacentHTML('beforeend', alertTitle);
            alertDiv.insertAdjacentHTML('beforeend', alertText);

            document.getElementById('allTodos').append(alertDiv);
        }
    }

    createTodoForm (heading = 'Create Todo', title = '', text = '', color = '', todoId = 0)
    {
        document.getElementById('todoActions').innerHTML = '';
        const createForm = document.createElement('form');

        const header = '<h4><u>' + heading + '</u></h4>';
        const formGroupTitle = '<div class="form-group"><label for="todoTitle">Title:</label><input type="text" class="form-control" id="todoTitle" name="todoTitle" placeholder="Title" maxlength="100" value="' + title + '"></div>';
        const formGroupText = '<div class="form-group"><label for="todoText">Text:</label><textarea class="form-control" id="todoText" name="todoText" placeholder="Text" maxlength="250">' + text + '</textarea></div>';
        const formGroupSelect = '<div class="form-group">' +
            '<label for="todoColor">Select color:</label>' +
            '<select class="form-control w-50" id="todoColor" name="todoColor" onchange="todoClass.setCurrentColor(this);">' +
            '<option value="change">-- choose --</option>' +
            '<option class="bg-primary text-white" value="primary">Dark blue</option>' +
            '<option class="bg-secondary text-white" value="secondary">Gray</option>' +
            '<option class="bg-success text-white" value="success">Green</option>' +
            '<option class="bg-danger text-white" value="danger">Red</option>' +
            '<option class="bg-warning text-white" value="warning">Yellow</option>' +
            '<option class="bg-info text-white" value="info">Light blue</option>' +
            '</select>';
        const formEditTodoId = '<input type="hidden" id="todoId" name="todoId" value="' + todoId + '">';
        const saveButton = '<button type="submit" class="btn btn-primary" onclick="todoClass.saveTodo();">Save</button>';

        createForm.id = 'todoForm';
        createForm.insertAdjacentHTML('beforeend', header);
        createForm.insertAdjacentHTML('beforeend', formGroupTitle);
        createForm.insertAdjacentHTML('beforeend', formGroupText);
        createForm.insertAdjacentHTML('beforeend', formGroupSelect);
        createForm.insertAdjacentHTML('beforeend', formEditTodoId);
        createForm.insertAdjacentHTML('beforeend', saveButton);

        if (todoId !== 0) {
            const options = createForm.getElementsByTagName('option');
            Object.keys(options).forEach(function (dd) {
                if (options[dd].value === color) {
                    options[dd].setAttribute('selected', '');
                }

            });

            const saveButton = createForm.getElementsByTagName('button');
            saveButton[0].setAttribute('onclick', 'todoClass.saveEditTodo();');

            console.log();
        }

        document.getElementById('todoActions').append(createForm);
        const todoColorSelector = document.getElementById('todoColor');
        this.setCurrentColor(todoColorSelector)
    }

    setCurrentColor(element)
    {
        const elementValue = element.value;

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

    saveTodo ()
    {
        todoForm.onsubmit = async (e) => {
            e.preventDefault();

            await fetch('index.php/todoAjax?action=saveTodo&saveType=insert', {
                method: 'POST',
                body: new FormData(todoForm)
            });

            this.getAllTodos();
            this.createTodoForm();
        };
    }

    saveEditTodo ()
    {
        todoForm.onsubmit = async (e) => {
            e.preventDefault();

            await fetch('index.php/todoAjax?action=saveTodo&saveType=update', {
                method: 'POST',
                body: new FormData(todoForm)
            });

            this.getAllTodos();
            this.createTodoForm();
        };
    }


    confirmAlert (todoId, action)
    {
        const todoElement = document.getElementById('todo_' + todoId);
        const todoTitle = todoElement.getElementsByTagName('h4')[0].textContent;

        if (action === 'edit') {

            document.getElementById('infoModalHeader').innerText = 'Edit Todo?';
            document.getElementById('infoModalBody').innerHTML = 'Todo "<u>' + todoTitle + '</u>" bearbeiten?';
            const modalSubmitButton = document.getElementById('infoModalSubmitButton');
            modalSubmitButton.setAttribute('onclick', 'todoClass.loadEditTodo(' + todoId + ')');
            $('#infoModal').modal('toggle');

        } else if (action === 'finish') {

            document.getElementById('infoModalHeader').innerText = 'Finish Todo?';
            document.getElementById('infoModalBody').innerHTML = 'Todo "<u>' + todoTitle + '</u>" auf erledigt setzen?';
            const modalSubmitButton = document.getElementById('infoModalSubmitButton');
            modalSubmitButton.setAttribute('onclick', 'todoClass.finishTodo(' + todoId + ');');
            $('#infoModal').modal('toggle');

        } else if (action === 'delete') {

            document.getElementById('infoModalHeader').innerText = 'Delete Todo?';
            document.getElementById('infoModalBody').innerHTML = 'Wollen sie wirklich todo mit dem Titel "<u>' + todoTitle + '</u>" löschen?';
            const modalSubmitButton = document.getElementById('infoModalSubmitButton');
            modalSubmitButton.setAttribute('onclick', 'todoClass.deleteTodo(' + todoId + ');');
            $('#infoModal').modal('toggle');
        }
    }

    loadEditTodo (todoId)
    {
        const todoElement = document.getElementById('todo_' + todoId);
        const todoTitle = todoElement.getElementsByTagName('h4')[0].textContent;
        const todoText = todoElement.getElementsByTagName('p')[0].textContent;
        const todoColor = todoElement.getAttribute('name');

        this.createTodoForm('Edit Todo', todoTitle, todoText, todoColor, todoId);
    }

    finishTodo (todoId)
    {
        const url = 'index.php/todoAjax?action=finishTodo&todoId=' + todoId;
        this.jsonCallToController(url).then(response => this.getAllTodos());
    }

    deleteTodo (todoId)
    {
        const url = 'index.php/todoAjax?action=deleteTodo&todoId=' + todoId;
        this.jsonCallToController(url).then(response => this.getAllTodos());
    }

}

document.addEventListener('DOMContentLoaded', function () {
    let todoMain = new TodoMainClass();

    todoMain.getAllTodos();
});