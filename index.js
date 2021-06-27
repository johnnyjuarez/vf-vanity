const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const dynamoDB = new AWS.DynamoDB();

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

exports.handler = async (event, context, callback) => {


  let phoneNumber = event['Details']['ContactData']['CustomerEndpoint']['Address'].substring(2);
  let vanityArray = [];

  const phoneNumberFormatFunc = (arr) => {
    return `(${arr.slice(0, 3).join('')}) ${arr.slice(3, 6).join('')}-${arr.slice(6).join('')}`;
  }

  const vanityGenerator = (teleNum) => {
    let duplicateNum = teleNum;
    // clause check for num to string
    if (typeof teleNum === 'number') {
      duplicateNum = teleNum.toString();
    }
    // split our 'number' into an array so that we can manipulate easier
    let splitDuplicate = phoneNumberFormatFunc(duplicateNum.split('')).split('');

    for (let i = splitDuplicate.length - 4; i < splitDuplicate.length; i++) {
      // placeholder for hashmap to clean
      let hashNum = hashmap[splitDuplicate[i]];
      // replacing the current index of telephone number with random letter assignment on hashmap
      splitDuplicate[i] = hashNum[Math.floor(Math.random() * hashNum.length)]
    }

    let result = splitDuplicate.join('');

    return result;
  }

  // function to generate 100 unique vanity numbers
  const addToVanityArray = () => {
    let count = 100;
    while (count > 0) {
      vanityArray.push(vanityGenerator(phoneNumber));
      count--;
    }
  }

  addToVanityArray();

  const isVowel = (letter) => {
    return ('aeiouAEIOU'.indexOf(letter) != -1);
  }

  const vanityFilter = (arr) => {
    let results = [];
    for (let i = 0; i < arr.length; i++) {
      if (results.length === 5) {
        break;
      }
      let current = arr[i].split('');
      let endOfCurrent = current[current.length - 1];
      if (isVowel(endOfCurrent) === true) {
        results.push(arr[i]);
      }
    }
    return results;
  };

  let filteredResults = vanityFilter(vanityArray);

  let params = {
    TableName: 'VANITY_NUMBERS',
    Item: {
      'PHONE_NUMBER': { S: phoneNumber },
      'VANITY_NUMBER': { S: filteredResults[0] },
      'VANITY_NUMBER_1': { S: filteredResults[1] },
      'VANITY_NUMBER_2': { S: filteredResults[2] },
      'VANITY_NUMBER_3': { S: filteredResults[3] },
      'VANITY_NUMBER_4': { S: filteredResults[4] }
    }
  };

  const results = {
    number_1: filteredResults[0],
    number_2: filteredResults[1],
    number_3: filteredResults[2],

  }

  dynamoDB.putItem(params);

  callback(null, results);
};
