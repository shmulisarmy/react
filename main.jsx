const taskLists = [
    {
        name: "To Do",
        tasks: {
            "Learn React": {
                name: "Learn React",
                complete: false
            },
            "Learn JavaScript": {
                name: "Learn JavaScript",
                complete: false
            },
        }
    },
    {
        name: "In Progress",
        tasks: {
            "Learn React": {
                name: "Learn React",
                complete: false
            },
            "Learn JavaScript": {
                name: "Learn JavaScript",
                complete: false
            },
        }
    },
    {
        name: "Done",
        tasks: {
            "Learn React": {
                name: "Learn React",
                complete: false
            },
            "Learn JavaScript": {
                name: "Learn JavaScript",
                complete: false
            },
        }
    },
]

let draggingTask = null
let draggingOver = null


function dragEnd() {
    console.log(draggingTask, draggingOver)
    draggingTask = null
    draggingOver = null
}


function  Task(task, taskListName) {
    return html`
        <div class="task" component="true" data-key="${store_data(task)}" draggable="true"
            ondragstart="draggingTask = {name: '${task.name}', taskListName: '${taskListName}'}"
            ondragenter="draggingOver = {name: '${task.name}', taskListName: '${taskListName}'}"
            ondragend="dragEnd()">
            <span>${task.name}</span>
        </div>
    `
}

function TaskList(taskList) {
    return html`
        <div class="task-list" component="true" data-key="${store_data(taskList)}">
            <h2>${taskList.name}</h2>
            /${Object.values(taskList.tasks).map(task => Task(task, taskList.name)).join("")}
        </div>
    `
}



function App() {
    return html`
        <main>
            /${taskLists.map(taskList => TaskList(taskList)).join("")}
        </main>
    `
}



root.outerHTML = App()