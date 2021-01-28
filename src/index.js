const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

const lcov = require('./lcov');
const { checkMinimumRatio } = require('./features/minimumRatio');
const {
  sendSummaryComment,
  getChangedFiles
} = require('./features/sendSummaryComment');

async function main() {
  let files = await getChangedFiles();
  console.log(files);

  const compareFile = core.getInput('lcov-file');
  const baseFile = core.getInput('base-lcov-file');
  core.info(`lcov-file: ${compareFile}`);
  core.info(`base-lcov-file: ${baseFile}`);

  const compareFileRaw = fs.readFileSync(compareFile, 'utf8');
  if (!compareFileRaw) {
    core.info(`No coverage report found at '${compareFile}', exiting...`);
    return;
  }

  const baseFileRaw = fs.readFileSync(baseFile, 'utf8');
  if (!baseFileRaw) {
    core.info(`No coverage report found at '${baseFileRaw}', exiting...`);
    return;
  }

  const baseFileData = await lcov.parse(baseFileRaw);
  const compareFileData = await lcov.parse(compareFileRaw);

  const comparePercentage = lcov.percentage(compareFileData);
  core.info(`Compare branch code coverage: ${comparePercentage}%`);

  const basePercentage = lcov.percentage(baseFileData);
  core.info(`Base branch code coverage: ${basePercentage}%`);

  const diff = (comparePercentage - basePercentage).toFixed(2);
  core.info(`Code coverage diff: ${diff}%`);

  await sendSummaryComment(diff, comparePercentage);
  checkMinimumRatio(diff);

  core.setOutput('percentage', comparePercentage);
  core.setOutput('diff', diff);
}

try {
  main();
} catch {
  console.log(err);
  core.setFailed(err.message);
}
