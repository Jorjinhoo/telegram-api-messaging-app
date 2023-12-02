const readline = require('readline');

const getUserInput = (ask) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise((resolve) => {
      rl.question(ask, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  };

  module.exports = getUserInput;