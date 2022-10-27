const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
var zlib = require('zlib');

exports.handler = function (input, context) {
  console.log(input);
  var payload = Buffer.from(input.awslogs.data, 'base64');
  zlib.gunzip(payload, async function (e, result) {
    if (e) {
      context.fail(e);
    } else {
      result = JSON.parse(result.toString());

      const logEvents = result.logEvents[0];
      const message = JSON.parse(logEvents.message);

      console.log("Event Data:", message);

      const params = {
        TableName: 'logs',
        Key: {
          ip: message.ip,
        },
        UpdateExpression: "SET total_r = if_not_exists(total_r, :start) + :inc, init_r = if_not_exists(init_r, :init), last_r = :last, total_length_payload = if_not_exists(total_length_payload, :start) + :t_payload",
        ExpressionAttributeValues: {
          ':inc': 1,
          ':start': 0,
          ':init': +(new Date()),
          ':last': +(new Date()) + 1,
          ':t_payload': +message.responseLength
        },
        ReturnValues: "UPDATED_NEW",
      };

      console.log('previous', params);
      try {
        ddb.update(params, (err, data) => {
          if (err) {
            console.log(err);
            context.fail();
          }
          context.succeed();
        });
      } catch (err) {
        console.log(err);
      }
      console.log('then');
    }
  });
};