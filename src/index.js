const fs = require('fs');
const core = require('@actions/core');

const lcov = require('./lcov');
const { sendComment } = require('./github');
const { checkCoverageRation } = require('./features/minCoverageRatio');

async function main() {
  const token = core.getInput('github-token');
  const compareFile = core.getInput('lcov-file');
  const baseFile = core.getInput('base-lcov-file');

  const compareFileRaw = fs.readFileSync(compareFile, 'utf8');

  if (!compareFileRaw) {
    console.log(`No coverage report found at '${compareFile}', exiting...`);
    return;
  }

  const baseFileRaw = fs.readFileSync(baseFile, 'utf8');

  if (!baseFileRaw) {
    console.log(`No coverage report found at '${baseFileRaw}', exiting...`);
    return;
  }

  const baseFileData = await lcov.parse(baseFileRaw);
  const compareFileData = await lcov.parse(compareFileRaw);

  const comparePercentage = lcov.percentage(compareFileData);
  console.log(`compare branch code coverage: ${comparePercentage}%`);

  const basePercentage = lcov.percentage(baseFileData);
  console.log(`compare branch code coverage: ${basePercentage}%`);

  const diff = comparePercentage - basePercentage;

  sendComment(token, diff, comparePercentage);
  checkCoverageRation(diff);

  core.setOutput('percentage', comparePercentage);
  core.setOutput('diff', diff);
}

try {
  main();
} catch {
  console.log(err);
  core.setFailed(err.message);
}
