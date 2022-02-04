const validaEmissao = require('./auto-valida-emissao')

exports.validaEmissao = (event, context, callback) => {
    validaEmissao.validaEmissao(event, context, callback);
}
