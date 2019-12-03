const fs = require("fs");

function readFile(fileName) {
    return fs.readFileSync(`./${fileName}`).toString();
}

function writeToFile(fileName, text) {
    fs.writeFileSync(`./${fileName}`, text);
}

function cryptoTextCaesar(offset, isEncrypt) {
    let word = "";

    if (isEncrypt) {
        word = readFile("caesarEncrypt.txt");
        word = word.toLowerCase().replace(/[a-z]/g, char => String.fromCharCode((char.charCodeAt(0) + offset - 97) % 26 + 97));
        writeToFile("caesarDecrypt.txt", word);
    } else {
        word = readFile("caesarDecrypt.txt");
        word = word.toLowerCase().replace(/[a-z]/g, char => String.fromCharCode((char.charCodeAt(0) - offset - 122) % 26 + 122));
        writeToFile("caesarEncrypt.txt", word);
    }
}

function cryptoTextVigener(key, isEncrypt) {
    const keys = filterKey(key);
    let word = "";
    if (isEncrypt) {
        word = readFile("vigenerEncrypt.txt");
    } else {
        word = readFile("vigenerDecrypt.txt");
    }
    word = word.toLowerCase();
    let output = "";
	for (let i = 0, j = 0; i < word.length; i++) {
        let c = word.charCodeAt(i);
        if (c >= 97 && c <= 122) {
            if (isEncrypt) {
                output += String.fromCharCode((c + keys[j % keys.length] - 97) % 26 + 97);
            } else {
                output += String.fromCharCode((c - keys[j % keys.length] - 122) % 26 + 122);
            }
            j++;
        } else {
            output += " ";
        }
    }
    
    if (isEncrypt) {
        word = writeToFile("vigenerDecrypt.txt", output);
    } else {
        word = writeToFile("vigenerEncrypt.txt", output);
    }
}

function filterKey(key) {
    const result = [];
    for (let i = 0; i < key.length; i++) {
        result.push((key.charCodeAt(i) - 97) % 26);
    }
    return result;
}

function kasiskiAnalyst(length) {
    let index = 0;
    let includes = {};
    let string = readFile("vigenerDecrypt.txt");
    string = string.replace(/ /g, "");
    for(let i = 0; i < 10; i++) {
        let substr = string.substring(index, index + length);
        includes[substr] = [];
        let include = index;
        while (include !== -1) {
            includes[substr].push(include);
            include = string.indexOf(substr, include + 1);
        }
        index += length;
    }
    const arrOfGcd = [];
    Object.keys(includes).forEach(el => {
        if(includes[el].length > 3) {
            arrOfGcd.push(gcdFromArray(includes[el]));
        }
    })
    return gcdFromArray(arrOfGcd);
}

function gcdFromArray(array) {
    if (array.length === 2) {
        return gcdOfTwoElements(array[0], array[1]);
    }
    let node = array[1] - array[0];
    for(let i = 0; i < array.length - 1; i++) {
        let element = array[i + 1] - array[i];
        node = gcdOfTwoElements(element, node)
    }
    return node;
}

function gcdOfTwoElements(a, b) {
    if (!b) {
      return a;
    }
    
    return gcdOfTwoElements(b, a % b);
}

function findKeyWord(length) {
    let obj = {};
    let string = readFile("vigenerDecrypt.txt");
    string = string.replace(/ /g, "");
    for(let i = 0; i < length; i++) {
        obj[i] = [];
    }

    for(let i = 0; i < string.length; i+=length) {
        Object.keys(obj).forEach(index => {
            obj[index].push(string.charAt(+i + +index))
        });
    }

    const populars = [];
    for(let i = 0; i < length; i++) {
       populars.push(findPopularChar(obj[i]));
    }
}

function findPopularChar(array) {
    let counted = array.reduce((acc, curr) => { 
        if (curr in acc) {
            acc[curr]++;
        } else {
            acc[curr] = 1;
        }

        return acc;
    }, {});

    let mode = Object.keys(counted).reduce((a, b) => counted[a] > counted[b] ? a : b);

    console.log(mode);
}



// console.log(cryptoTextCaesar(20, true));
// console.log(cryptoTextCaesar(20, false));
cryptoTextVigener("mouse", true);
// cryptoTextVigener("mouse", false);
console.log(kasiskiAnalyst(3));
findKeyWord(5);