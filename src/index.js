const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const lcov = require('./lcov');

async function main() {
  const token = core.getInput('github-token');
  const baseFile = core.getInput('lcov-file');
  const headFile = core.getInput('head-lcov-file');

  const baseFileRaw = fs.readFileSync(baseFile, 'utf8');

  if (!baseFileRaw) {
    console.log(`No coverage report found at '${baseFile}', exiting...`);
    return;
  }

  const headFileRaw = fs.readFileSync(headFile, 'utf8');

  if (!headFileRaw) {
    console.log(`No coverage report found at '${headFileRaw}', exiting...`);
    return;
  }

  const headFileData = await lcov.parse(headFileRaw);
  const baseFileData = await lcov.parse(baseFileRaw);

  console.log(baseFileData);
  console.log(headFileData);

  const percentage = lcov.percentage(baseFileData);

  core.setOutput('percentage', percentage);
}

main().catch(function (err) {
  console.log(err);
  core.setFailed(err.message);
});
