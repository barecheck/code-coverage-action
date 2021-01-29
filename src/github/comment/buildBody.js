const { uncoveredFileLinesByFileNames } = require('../../lcov');
const { mergeFileLinesWithChangedFiles } = require('../../coverage');

const buildCommentDetails = require('./buildDetails');

const buildBody = (
  changedFiles,
  coverageDiff,
  totalCoverage,
  compareFileData
) => {
  const uncoveredFileLines = uncoveredFileLinesByFileNames(
    changedFiles.map(({ filename }) => filename),
    compareFileData
  );

  const fileLinesWithChangedFiles = mergeFileLinesWithChangedFiles(
    uncoveredFileLines,
    changedFiles
  );

  const commentDetailsMessage = buildCommentDetails(fileLinesWithChangedFiles);

  const trendArrow = coverageDiff === 0 ? '' : coverageDiff < 0 ? '▾' : '▴';
  const header = 'Barecheck - Code coverage report';
  const descTotal = `Total: <b>${totalCoverage}%</b>`;
  const descCoverageDiff = `Your code coverage diff: <b>${coverageDiff}% ${trendArrow}</b>`;
  const description = `${descTotal}\n\n${descCoverageDiff}`;

  const body = `<h3>${header}</h3>${description}\n\n${commentDetailsMessage}`;

  return body;
};

module.exports = buildBody;
