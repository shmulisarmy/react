function Skills(Skills){
    return html`
        <ul class="skills">
            /${Skills.map(skill => html`<li class="skill">${skill}</li>`).join("")}
        </ul>
    `
}


function User(user){
    const {name, age, city, country, photo, skills} = user
    const componet_ref_key = genrefKey()
    return html`
        <div class="user" data-key="${store_data(user)}" 
            ref_key="${componet_ref_key}">
            <img src="${photo}" alt="Photo of ${name}" />
            <h2>${name}</h2>
            <p>${age}</p>
            <p>${city}</p>
            <p>${country}</p>
            /${Skills(skills)}
            <input type="text" oninput=${(e) => {user.name = e.target.value; rerender(componet_ref_key, User)}} />
            <button onclick=${(e) => {user.name = "bob"; rerender(componet_ref_key, User)}}>alert</button>
            <button onclick=${(e) => {set(componet_ref_key, User, 'name', 'bob')}}>change name to bob</button>
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