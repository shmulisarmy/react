




function Todo(props){
    const {todo, removeTodo, editingTitle} = props
    const {title, date, completed} = todo
    const componet_ref_key = genrefKey()


    return html`
        <div class="todo" data-key="${store_data(props)}"
            ref_key="${componet_ref_key}">  
            /${editingTitle ? html`<input value="${title}" type="text" onchange=${(e) => {todo.title = e.target.value; rerender(componet_ref_key, Todo)}}/>` : html`<h2>${title}</h2>`}
            <p>${date}</p>
            <input type="checkbox" ${completed? "checked" : ""} 
            onchange=${(e) => {todo.completed = e.target.checked; rerender(componet_ref_key, Todo, () => alert(todo.completed? "this todo is completed" : "this todo is not completed"))}}/>
            <button  class="x" onclick=${(e) => {removeTodo(todo, componet_ref_key)}}>x</button>
            <button onclick=${(e) => {props.editingTitle = !editingTitle; rerender(componet_ref_key, Todo)}}>${editingTitle? "save" : "edit"}</button>
        </div>
            `
        }


function Todoform(props){
    const input = props.input
    const componet_ref_key = genrefKey()

    return html`
    <form ref_key="${componet_ref_key}" data-key="${store_data(props)}">
    <h1>${input}</h1>
            <input value="${input}" type="text" onchange=${(e) => {props.input = e.target.value; rerender(componet_ref_key, Todoform)}}/>
        </form>
    `
}



function Todos(){
    const componet_ref_key = genrefKey()


    // alert("the todos component wich is the size of many todos is rendering now")


    function removeTodo(todo, ref_key){
        todos.splice(todos.indexOf(todo), 1)
        rerender(componet_ref_key, Todos)
        ref_store[ref_key].remove()
    }

    return html`
        <main id="root" ref_key="${componet_ref_key}">
            /${todos.map(todo => Todo({todo, removeTodo, editingTitle: false})).join("")}
        </main>
        <button onclick=${(e) => {todos.push({title: prompt("title: "), date: new Date(), completed: false}); rerender(componet_ref_key, Todos)}}>add todo</button>

        /${Todoform({input: ""})}

        
    
    `
}

function App() {
    return html`
        /${Todos()}
    `
}



root.outerHTML = App()

activateAllRefs(root)



