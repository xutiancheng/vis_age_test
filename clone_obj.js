function clone_object(obj) {
        var newObj = (obj instanceof Array) ? [] : {};
        for (i in obj) {
                if (obj[i] && typeof obj[i] == "object") {
                        newObj[i] = clone_object(obj[i]);
                } else newObj[i] = obj[i]
        }
        return newObj;
}

function getObjectSize(obj) {
        var size = 0, key;
        for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
        }
        return size;
}