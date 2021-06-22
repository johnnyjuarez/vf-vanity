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

vanityGenerator(testNumber);