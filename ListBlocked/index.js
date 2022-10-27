const AWS = require("aws-sdk");
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {
  // TODO implement
  const params = {
    TableName: 'blocked'
  };

  const result = await dynamoDbClient.scan(params).promise();
  console.log(result);
  return result.Items;
};
