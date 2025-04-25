const bcrypt = require("bcrypt");

//Encripta un textp
function encriptar(texto, saltRounds) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(texto, salt);
    return hash;
}

//Compara texto plano con una cadena hasheada
function compare(texto, hash){
    return bcrypt.compareSync(texto, hash);
}

module.exports = { encriptar, compare }