const cleanHTMLMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
};
function cleanHTML(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[&<>"']/g, function(match) {
        return cleanHTMLMap[match];
    });
}

function html(strings, ...args) {
    let result = '';

    for (let i = 0; i < strings.length; i++) {
        if (strings[i][strings[i].length - 1] == "/"){
            const substring = strings[i].substring(0, strings[i].length - 1);
            if (substring != false) {
                result += substring;
            }
         } else {
                result += strings[i];
            }
        if (i < args.length) {
            if (strings[i][strings[i].length - 1] == "/"){
               result += args[i];
            } else {
                result += cleanHTML(args[i]);
            }
        }
    }

    return result;
}

function createElementFromHTML(htmlString) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString.trim();
    return tempDiv.firstChild;
}

function rerender(button, component){
    let element = button;
    while (!element.hasAttribute("component")) {
            element = element.parentElement;
        }
        const primaryJsonData = data_store[element.getAttribute("data-key")];
        element.parentElement.replaceChild(createElementFromHTML(component(primaryJsonData)), element);
        activateAllRefs(element)
}

function set(button, component, key, value){
    let element = button;
    while (!element.hasAttribute("component")) {
            element = element.parentElement;
        }
        const primaryJsonData = data_store[element.getAttribute("data-key")];
        primaryJsonData[key] = value
        const newElement = createElementFromHTML(component(primaryJsonData));
        element.parentElement.replaceChild(newElement, element);
        activateAllRefs(newElement)
}

const data_store = {}
let data_store_upto = 1

function store_data(data){
    data_store[data_store_upto] = data
    data_store_upto++
    return data_store_upto - 1
}

const function_store = {}
let function_store_upto = 1

function store_function(func){
    function_store[function_store_upto] = func
    function_store_upto++
    return function_store_upto - 1
}

const ref_store = {}
let ref_store_upto = 1

function store_ref(element){
    ref_store[ref_store_upto] = element
    ref_store_upto++
    return ref_store_upto - 1
}

/**
 * generates a ref key for later storage in a reserved spot
 * @return {number}
 */
function genrefKey(){
    ref_store_upto++
    return ref_store_upto - 1
}

/**
 * 
 * @param {HTMLElement} element this is the element tha will have all items with the ref attribute as child activateed
 */
function  activateAllRefs(element){
    const allRefElements = element.querySelectorAll("[ref_key]")
    allRefElements.forEach(element => {
        const ref_key = element.getAttribute("ref_key")
        ref_store[ref_key] = element
    })
}