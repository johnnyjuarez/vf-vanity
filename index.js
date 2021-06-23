const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB();

const docClient = new AWS.DynamoDB.DocumentClient();

// const params = {
//   TableName: 'Test',
//   KeySchema: [
//     { AttributeName: 'PhoneNumber', KeyType: 'HASH' },
//     { AttributeName: 'VanityNumber', KeyType: 'RANGE' }
//   ],
//   AttributeDefinitions: [
//     { AttributeName: 'PhoneNumber', AttributeType: 'N' },
//     { AttributeName: 'VanityNumber', AttributeType: 'S' }
//   ],
//   ProvisionedThroughput: {
//     ReadCapacityUnits: 5,
//     WriteCapacityUnits: 5
//   }
// }

// dynamodb.createTable(params, function (err, data) {
//   if (err) {
//     console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
//   } else {
//     console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
//   }
// });

const testNumber = 9498132551;

const hashmap = {
  1: ['A', 'E', 'I', 'O', 'U', 'Y'],
  2: ['A', 'B', 'C'],
  3: ['D', 'E', 'F'],
  4: ['G', 'H', 'I'],
  5: ['J', 'K', 'L'],
  6: ['M', 'N', 'O'],
  7: ['P', 'Q', 'R', 'S'],
  8: ['T', 'U', 'B'],
  9: ['W', 'X', 'Y', 'Z'],
  0: ['A', 'E', 'I', 'O', 'U']
}

const vanityGenerator = (teleNum) => {
  let duplicateNum = teleNum;
  // clause check for num to string
  if (typeof teleNum === 'number') {
    duplicateNum = teleNum.toString();
  }
  // split our 'number' into an array so that we can manipulate easier
  let splitDuplicate = duplicateNum.split('')

  for (let i = splitDuplicate.length - 4; i < splitDuplicate.length; i++) {
    // placeholder for hashmap to clean
    let hashNum = hashmap[splitDuplicate[i]];
    // replacing the current index of telephone number with random letter assignment on hashmap
    splitDuplicate[i] = hashNum[Math.floor(Math.random() * hashNum.length)]
  }

  let result = splitDuplicate.join('');

  return result;
}

const writeToDB = () => {
  let count = 5;
  let newArr = [];

  while (count > 0) {
    newArr.push(vanityGenerator(testNumber))
    count--
  }

  let params = {
    TableName: 'Test',
    Item: {
      PhoneNumber: testNumber,
      VanityNumber: newArr[0],
      VanityNumber_1: newArr[1],
      VanityNumber_2: newArr[2],
      VanityNumber_3: newArr[3],
      VanityNumber_4: newArr[4]
    }
  }
  console.log('adding a new item....');
  docClient.put(params, (err, data) => {
    if (err) {
      console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2))
    }
  })

}

let params = {
  TableName: 'Test'
}

docClient.scan(params, onScan);

function onScan(err, data) {
  if (err) {
    console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
  } else {
    console.log('Scan succeeded');
    console.log(data);
  }
}

// writeToDB();

// vanityGenerator(testNumber);