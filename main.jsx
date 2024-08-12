function dragEnter(componet_ref_key){
    for (const spc of document.querySelectorAll(".space")){
        spc.classList.remove("space")
    }
    const element = get_element(componet_ref_key)
    console.log(element)
    const parent = element.parentElement
    const index = Array.from(parent.children).indexOf(element)
    const space = document.createElement("div")
    space.classList.add("space")
    parent.insertBefore(space, parent.children[index+1])
}


function Task({task, deleteTask}){
    const componet_ref_key = genrefKey()

    return html`<div class="task" 
    ref_key="${componet_ref_key}"
    draggable="true"
    ondragenter=${() => dragEnter(componet_ref_key)}>
        <h1>${task.title}</h1>
        <p>${task.date}</p>
        <p>${task.completed}</p>
        <p>${task.assignee}</p>
        <button class="x" onclick=${() => {deleteTask(task.title, componet_ref_key)}}>X</button>
    </div>
    `
}


function TaskList({taskList, taskListName}){

    function deleteTask(title, componet_ref_key){
        delete taskList[title]
        const element = get_element(componet_ref_key)
        element.classList.add("deleted")
        setTimeout(() => element.remove(), 1000)
    }

    return html`
    <section class="taskList">
        <h1>${taskListName}</h1>
        <p signal="hey"></p>
        <div class="tasks-container">
            /${Object.values(taskList).map(task => Task({task, deleteTask})).join("")}
        </div>
    </section>
    `
}

function form(){
    const updateSig = createSignal("hello", "hey")
    return html`
    <button onclick=${() => updateSig(prompt("input: "))} signal="hey" signalFunc=${(elm, value) => {
        console.log(elm, "is changed to", value)
        elm.style.color = value
    }}>hello you there</button>
    `
}

function App(){

    return html`
    <main>
        /${Object.keys(taskLists).map(taskListName => {const taskList = taskLists[taskListName]; return TaskList({taskList, taskListName})}).join("")}
    </main>
    /${form()}
    `
}


root.innerHTML = App()
activateAllRefs(root)
activateAllsignals(root)