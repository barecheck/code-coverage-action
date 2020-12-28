const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');
const lcov = require('./lcov');

async function main() {
  const token = core.getInput('github-token');
  const baseFile = core.getInput('lcov-file');
  const headFile = core.getInput('head-lcov-file');

  const baseFileRaw = fs.readFileSync(
    path.join(__dirname, '../', baseFile),
    'utf8'
  );

  if (!baseFileRaw) {
    console.log(`No coverage report found at '${baseFile}', exiting...`);
    return;
  }

  const headFileRaw = fs.readFileSync(
    path.join(__dirname, '../', headFile),
    'utf8'
  );

  if (!headFileRaw) {
    console.log(`No coverage report found at '${headFileRaw}', exiting...`);
    return;
  }

  const headFileData = await lcov.parse(headFileRaw);
  const baseFileData = await lcov.parse(baseFileRaw);

  const basePercentage = lcov.percentage(baseFileData);
  const headPercentage = lcov.percentage(headFileData);

  const diff = basePercentage - headPercentage;

  core.setOutput('percentage', basePercentage);
  core.setOutput('diff', diff);
}

main().catch(function (err) {
  console.log(err);
  core.setFailed(err.message);
});
