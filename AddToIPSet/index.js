const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-2' });
const waf = new AWS.WAFV2({ region: "us-east-2" });

exports.handler = async (event) => {
  const { Records } = event;
  const { dynamodb, eventName } = Records[0];

  const ipSet = await waf.getIPSet({
    Id: "699bbd88-3265-4209-80bf-2afe735bdd19",
    Name: "Block",
    Scope: "REGIONAL"
  }).promise();

  const { LockToken, IPSet } = ipSet;
  let addresses = IPSet.Addresses;

  const ip = `${dynamodb.Keys.ip.S}/32`;

  let newAddresses = [...new Set([...addresses, ip])];

  if (eventName === 'REMOVE') {
    console.log('Removing', dynamodb);
    newAddresses = newAddresses.filter(it => it != ip);
  }

  console.log(addresses, newAddresses);

  const params = {
    Name: 'Block',
    Scope: 'REGIONAL',
    Id: '699bbd88-3265-4209-80bf-2afe735bdd19',
    Addresses: newAddresses,
    LockToken
  };

  const res = await waf.updateIPSet(params).promise();
  return res.NextLockToken;
};
