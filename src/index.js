const fs = require("fs");
const core = require("@actions/core");
const github = require("@actions/github");

const lcov = require("./lcov");
const { checkMinimumRatio } = require("./features/minimumRatio");
const { sendSummaryComment } = require("./features/sendSummaryComment");
const { showAnnotations } = require("./features/showAnnotations");
const { sendMetricsToBarecheck } = require("./features/barecheckApi");

const runFeatures = async (diff, comparePercentage, compareFileData) => {
  await sendSummaryComment(diff, comparePercentage, compareFileData);
  checkMinimumRatio(diff);
  await showAnnotations(compareFileData);

  await sendMetricsToBarecheck(comparePercentage);
  core.setOutput("percentage", comparePercentage);
  core.setOutput("diff", diff);
};

const runCodeCoverage = async (baseFileRaw, compareFileRaw) => {
  console.log(
    github.context,
    github.context.payload.pull_request.base,
    github.context.payload.pull_request.head
  );
  const baseFileData = await lcov.parse(baseFileRaw);
  const compareFileData = await lcov.parse(compareFileRaw);

  const comparePercentage = lcov.percentage(compareFileData);
  core.info(`Compare branch code coverage: ${comparePercentage}%`);

  const basePercentage = lcov.percentage(baseFileData);
  core.info(`Base branch code coverage: ${basePercentage}%`);

  const diff = (comparePercentage - basePercentage).toFixed(2);
  core.info(`Code coverage diff: ${diff}%`);

  await runFeatures(diff, comparePercentage, compareFileData);
};

async function main() {
  const compareFile = core.getInput("lcov-file");
  const baseFile = core.getInput("base-lcov-file");
  core.info(`lcov-file: ${compareFile}`);
  core.info(`base-lcov-file: ${baseFile}`);

  const compareFileRaw = fs.readFileSync(compareFile, "utf8");
  if (!compareFileRaw)
    throw new Error(`No coverage report found at '${compareFile}', exiting...`);

  const baseFileRaw = fs.readFileSync(baseFile, "utf8");
  if (!baseFileRaw)
    throw new Error(`No coverage report found at '${baseFileRaw}', exiting...`);

  await runCodeCoverage(baseFileRaw, compareFileRaw);
}

try {
  main();
} catch (err) {
  core.info(err);
  core.setFailed(err.message);
}
