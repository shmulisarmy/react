function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

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
            if (typeof args[i] == "function") {
                result += `"function_store[${store_function(args[i])}](event)"`;
                continue;
            }
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
    if (typeof htmlString !== 'string') {
        throw new Error('Expected a string as input not a ' + typeof htmlString);
    }

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString.trim();;
    return tempDiv.firstChild;
}


function rerender(component_ref_key, component_maker, useEffect){
    console.log(component_ref_key)
    const element = ref_store[component_ref_key]
    const primaryJsonData = data_store[element.getAttribute("data-key")];
    const newElement = createElementFromHTML(component_maker(primaryJsonData));
    element.parentElement.replaceChild(newElement, element);
    activateAllRefs(newElement)
    if (useEffect){
        useEffect();
    }
}


function set(component_ref_key, component_maker, key, value){
    const element = ref_store[component_ref_key]
    const primaryJsonData = data_store[element.getAttribute("data-key")];
    primaryJsonData[key] = value
    const newElement = createElementFromHTML(component_maker(primaryJsonData));
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
    if (element.hasAttribute("ref_key")) {
        const ref_key = element.getAttribute("ref_key")
        ref_store[ref_key] = element
    }
    const allRefElements = element.querySelectorAll("[ref_key]")
    allRefElements.forEach(element => {
        const ref_key = element.getAttribute("ref_key")
        ref_store[ref_key] = element
    })
}


const funcs = {}

function memo(key, func, dependencies){ 
    funcs[key] = {func, dependencies, result: func(dependencies)}
}


function getMemo(funcKey, dependencies){
    if (deepEqual(funcs[funcKey].dependencies, dependencies)){
            return funcs[funcKey].result;
    }
    funcs[funcKey].dependencies = dependencies
    funcs[funcKey].result = funcs[funcKey].func(dependencies)
    return funcs[funcKey].result
}




const signals = {}
function updateSignal(key, value){
    signals[key].value = value
    for (let i = 0; i < signals[key].listeners.length; i++){
        signals[key].listeners[i].textContent = signals[key].value
    }
}

function createSignal(key, value){
    signals[key] = {
        value: value,
        listeners: []
    }
    updateSignal(key, value)
}

function listen(key, listener){
    signals[key].listeners.push(listener)
    listener.textContent = signals[key].value
}






function deepEqual(obj1, obj2, seen = new Set()) {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    if (seen.has(obj1) || seen.has(obj2)) {
        return obj1 === obj2;
    }

    seen.add(obj1);
    seen.add(obj2);

    if (obj1.constructor !== obj2.constructor) {
        return false;
    }

    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }

    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
        return obj1.toString() === obj2.toString();
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (!deepEqual(obj1[i], obj2[i], seen)) {
                return false;
            }
        }
        return true;
    }

    if (obj1 instanceof Map && obj2 instanceof Map) {
        if (obj1.size !== obj2.size) {
            return false;
        }
        for (let [key, val] of obj1) {
            if (!obj2.has(key) || !deepEqual(val, obj2.get(key), seen)) {
                return false;
            }
        }
        return true;
    }

    if (obj1 instanceof Set && obj2 instanceof Set) {
        if (obj1.size !== obj2.size) {
            return false;
        }
        for (let val of obj1) {
            if (!obj2.has(val)) {
                return false;
            }
        }
        return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key], seen)) {
            return false;
        }
    }

    return true;
}

