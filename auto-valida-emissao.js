const oracledb = require("oracledb")
const dbconfig = require("./dbconfig")
const envioSms = require("./sns")

    function executeQuery(query, params, callback, response) {

        var connection = oracledb.getConnection({
            user: dbconfig.user,
            password: dbconfig.password,
            connectString: dbconfig.connectString
        })
        connection.connect(function (err) {
            if (err) {
                console.log(err.message)
                callback(null, buildInternalServerError())
            }
        })

        connection.execute(
            query, params, (err, result) => {
                if (err) {
                    console.log(err.message);
                }
                connection.close(
                    (err) => {
                        if (err) {
                            callback(null, err.message)
                        }

                    });

                callback(null, buildStatusOk(response(result)));
            });
    }

module.exports.validaEmissao = (event, context, callback) => {
    const body = JSON.parse(event.body)


    executeQuery('SELECT COD_SPE FROM TB_SPE WHERE COD_SPE = :codSpe',
        body.speDTO.codSpe, callback,(err, result) => {
        if (err) {
            throw err;

        } if (result)
            return envioSms;
    })
}
function buildResponse(statusCode, message) {
    const response = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin" : "*"
        },
        "body": JSON.stringify(message),
        "isBase64Encoded": false
    };
    return response;
}

function errorJsonMessage(message) {
    const json = {
        message : message
    };
    return json;

}

function buildInternalServerError(){
    return buildResponse(500, errorJsonMessage
    ("Erro inesperado, entre em contato com o administrador do sistema e informe o código fornecido.") )
}

function buildStatusOk(json) {
    return buildResponse(200, json);
}

