const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  const ip = event.rawPath.replace('/', '');
  console.log(event, ip);


  var params = {
    TableName: 'blocked',
    Key: {
      'ip': { S: ip }
    }
  };
  await dynamodb.deleteItem(params).promise();
  return true;
};
