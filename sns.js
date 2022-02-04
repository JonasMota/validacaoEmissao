const AWS = require('aws-sdk');
AWS.config.update({
    region: 'sa-east-1',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCSESS_KEY_ID

});

var params = {
    Message: 'Teste qqCoisa',
    TopicArn: process.env.SNS_TOPIC
};

var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

var envioSms =  publishTextPromise.then(
  function(data) {
        console.log("MessageID is " + data.MessageId + " SMS enviado!");
    }).catch(
    function(err) {
        console.error(err, err.stack);
    });

module.exports = envioSms
