function Skills(Skills){
    return html`
        <ul class="skills">
            /${Skills.map(skill => html`<li class="skill">${skill}</li>`).join("")}
        </ul>
    `
}


function User(user){
    const {name, age, city, country, photo, skills} = user
    const ref_key = genrefKey()
    return html`
        <div class="user" component="true" data-key="${store_data(user)}" 
            style="padding: 10px; border: 1px solid black;"
            onclick="ref_store[${ref_key}].textContent = 'clicked'">
            <img src="${photo}" alt="Photo of ${name}" />
            <h2>${name}</h2>
             <p>${age}</p>
            <p>${city}</p>
            <p>${country}</p>
            /${Skills(skills)}
            <button ref_key="${ref_key}" onclick="function_store[${store_function(() => alert('alert'))}]()">alert</button>
            <button onmouseover="set(this, User, 'name', 'bob')">change name to bob</button>
        </div>`
}



function App() {
    return html`
        <main>
            /${users.map(user => User(user)).join("")}
        </main>
    
    `
}











document.querySelector("main").outerHTML = App();

/**
 * makes it possible to use refs with a 
 * ref key by placing each ref in the ref store with the ref key 
 * placed as the ref_key attribute
 */
activateAllRefs(document.querySelector("main"))