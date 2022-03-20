const core = require("@actions/core");

const { parseLcovFile } = require("barecheck");

const { getLcovFile } = require("./input");

const sendSummaryComment = require("./services/sendSummaryComment");
const showAnnotations = require("./services/showAnnotations");
const checkMinimumRatio = require("./services/minimumRatio");
const getBaseCoverageDiff = require("./services/baseCoverageDiff");
const getChangedFilesCoverage = require("./services/changedFilesCoverage");

const runCodeCoverage = async (coverage) => {
  const diff = await getBaseCoverageDiff(coverage);
  core.info(`Code coverage diff: ${diff}%`);

  const changedFilesCoverage = await getChangedFilesCoverage(coverage);
  await sendSummaryComment(changedFilesCoverage, diff, coverage.percentage);

  await checkMinimumRatio(diff);
  await showAnnotations(changedFilesCoverage);

  core.setOutput("percentage", coverage.percentage);
  core.setOutput("diff", diff);
};

async function main() {
  try {
    const compareFile = getLcovFile();

    core.info(`lcov-file: ${compareFile}`);

    const coverage = await parseLcovFile(compareFile);
    core.info(`Current code coverage: ${coverage.percentage}%`);

    await runCodeCoverage(coverage);
  } catch (err) {
    core.info(err);
    core.setFailed(err.message);
  }
}

main();
