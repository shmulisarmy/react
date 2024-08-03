
let count = 0;
const counter = () => {
    return count++
}


function Todo(props){
    const {todo, removeTodo, editingTitle} = props
    const {title, date, completed, id} = todo
    const componet_ref_key = genrefKey()
    const sig = createSignal(title, "hey")


    return html`
        <div class="todo" rerender-with="Todo" ${props}
        
            ref_key="${componet_ref_key}">  
            /${editingTitle ? html`<input value="${title}" type="text" oninput=${(e) => {todo.title = e.target.value; updateSignal(sig, counter())}}/>` : html`<h2>${title}</h2>`}
            <p signal="${sig}">hello</p>
            <p>${date}</p>
            <input type="checkbox" ${completed? "checked" : ""} 
            onchange=${(e) => {todo.completed = e.target.checked; rerender(componet_ref_key, () => alert(todo.completed? "this todo is completed" : "this todo is not completed"))}}/>
            <button  class="x" onclick=${(e) => {removeTodo(todo, componet_ref_key)}}>x</button>
            <button onclick=${(e) => {props.editingTitle = !editingTitle; rerender(componet_ref_key)}}>${editingTitle? "save" : "edit"}</button>
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
        const todo_index = todos.indexOf(todo)
        if (todo_index === -1) {
            alert("sorry it seems like we can find this todo is not found in its parent list")
            return}
        todos.splice(todo_index, 1)
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
    <h1>todos</h1>
    <button onclick="('hello world')">click</button>
        /${Todos()}
    `
}



root.outerHTML = App()

activateAllRefs(root)
activateAllsignals(root)
listen("body", document.querySelector("h1"))
listen("body", document.querySelectorAll("h1")[1])


