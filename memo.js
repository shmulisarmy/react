const funcs = {}

function memo(key, func, deepEqual){ 
    funcs[key] = {func, deepEqual, memoed: false}
}


function getMemo(funcKey, dependencies){
    if (deepEqual(funcs[funcKey].dependencies, dependencies)){
            if (!funcs[funcKey].memoed){
                funcs[funcKey].result = funcs[funcKey].func()
                funcs[funcKey].memoed = true
            }
        } else {
            funcs[funcKey].dependencies = dependencies
            funcs[funcKey].result = funcs[funcKey].func()
            funcs[funcKey].memoed = true
    }
    return funcs[funcKey].result
}


function deepEqual(obj1, obj2, seen = new Set()) {
    // Directly compare primitive types and return true if they are equal
    if (obj1 === obj2) {
        return true;
    }

    // If either value is not an object (or is null), return false
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    // Handle circular references
    if (seen.has(obj1) || seen.has(obj2)) {
        return obj1 === obj2;
    }

    seen.add(obj1);
    seen.add(obj2);

    // Compare constructors to ensure objects are of the same type
    if (obj1.constructor !== obj2.constructor) {
        return false;
    }

    // Handle special types like Date and RegExp
    if (obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
    }

    if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
        return obj1.toString() === obj2.toString();
    }

    // Handle arrays
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

    // Handle Maps
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

    // Handle Sets
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

    // Handle plain objects
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