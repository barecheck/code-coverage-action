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

  return ((hit / found) * 100).toFixed(2);
};

const getUncoveredFilesLines = (lcovData) => {
  const response = [];

  for (const fileData of lcovData) {
    const lines = fileData.lines.details
      .filter(({ hit }) => hit === 0)
      .map(({ line }) => line);

    if (lines.length > 0) {
      response.push({
        file: fileData.file,
        lines
      });
    }
  }

  return response;
};

const getGroupedUncoveredFileLines = (filesLines) => {
  return filesLines.map(({ file, lines }) => {
    const groupedLines = [];
    let previousLine = null;
    let startLine = null;

    const pushCurrentStateToArray = () =>
      groupedLines.push(
        startLine !== previousLine ? [startLine, previousLine] : previousLine
      );

    for (const line of lines) {
      // initialize first element
      if (startLine === null) {
        startLine = line;
        previousLine = line;
        continue;
      }

      /// group elements to range
      if (previousLine !== line - 1) {
        pushCurrentStateToArray();
        startLine = line;
      }

      previousLine = line;
    }

    // Push last element
    pushCurrentStateToArray();

    return { file, lines: groupedLines };
  });
};

const uncoveredFileLinesByFileNames = (fileNames, lcovData) => {
  const uncoveredFileLines = getUncoveredFilesLines(
    lcovData
  ).filter(({ file }) => fileNames.includes(file));

  const groupedUncoveredFileLines = getGroupedUncoveredFileLines(
    uncoveredFileLines
  );

  return groupedUncoveredFileLines;
};

module.exports = {
  parse,
  percentage,
  getUncoveredFilesLines,
  getGroupedUncoveredFileLines,
  uncoveredFileLinesByFileNames
};
