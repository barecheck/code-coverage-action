const lcov = require('lcov-parse');

const parse = (data) => {
  return new Promise(function (resolve, reject) {
    lcov(data, function (err, res) {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
};

const percentage = (lcov) => {
  let hit = 0;
  let found = 0;
  for (const entry of lcov) {
    hit += entry.lines.hit;
    found += entry.lines.found;
  }

  return (hit / found) * 100;
};

module.exports = {
  parse,
  percentage
};
