const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `lcov-file` input defined in action metadata file
  const fileName = core.getInput('lcov-file');
  const headFileName = core.getInput('head-lcov-file');
  console.log(`File name ${fileName}!`);
  console.log(`Head File name ${headFileName}!`);

  const time = new Date().toTimeString();
  core.setOutput('time', time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
