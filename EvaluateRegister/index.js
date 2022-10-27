const AWS = require("aws-sdk");
const sageMakerRuntime = new AWS.SageMakerRuntime({
  region: "us-east-2"
});

const ddb = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

exports.handler = async (event) => {
  const { Records } = event;
  const { dynamodb, eventName } = Records[0];
  console.log(event);
  console.log(dynamodb);

  if (eventName === 'REMOVE') {
    console.log('Removing', dynamodb);
    return;
  }

  const EndpointName = 'tensorflow-inference-2022-09-20-16-46-17-186';

  const initTime = +dynamodb.NewImage.init_r.N;
  const lastTime = +dynamodb.NewImage.last_r.N;
  const seconds = (lastTime - initTime) / 1000 || 0.001;
  const minutes = seconds / 60;
  console.log({ seconds, minutes });

  // FOR DEMO PURPOSES
  const ip = dynamodb.NewImage.ip.S;
  const total_bwd = +dynamodb.NewImage.total_length_payload.N / 100; //DEMO PURPOSES
  const total = +dynamodb.NewImage.total_r.N * 1000; // DEMO PURPOSES
  const mean_bwd = total_bwd / total;
  const frequence = total / minutes;

  const values = [total_bwd, mean_bwd, frequence, total];
  const Body = `[[${values.join(',')}]]`;

  console.log(Body);

  var params = {
    Body,
    EndpointName,
    ContentType: "application/json"
  };

  console.log(params);
  const resp = await sageMakerRuntime.invokeEndpoint(params).promise();
  const respBody = resp.Body;
  const bString = Buffer.from(respBody).toString();
  const obj = JSON.parse(bString);

  const prediction = String(obj.predictions).replace(/\[/g, '').replace(/\]/g, '');
  console.log(prediction);

  console.log("Respuesta de la prediccion: ", { ip, prediction }, prediction);

  if (+prediction === 0) {
    console.log("Ip benigna");
    return;
  }

  console.log('Blocking IP', ip);
  const paramsUpdate = {
    TableName: 'blocked',
    Key: {
      ip,
    },
    UpdateExpression: "SET #ts = :timestamp, visitas = :visitas, init_r = :initTime, last_r = :lastTime",
    ExpressionAttributeNames: {
      "#ts": "timestamp"
    },
    ExpressionAttributeValues: {
      ':timestamp': +(new Date()),
      ':visitas': total / 1000,
      ':initTime': initTime,
      ':lastTime': lastTime
    },
    ReturnValues: "UPDATED_NEW",
  };

  const res = await ddb.update(paramsUpdate).promise();
  console.log('previous', paramsUpdate, res);
  return true;
};
