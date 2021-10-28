const core = require("@actions/core");

const { checkMinimumRatio } = require("./features/minimumRatio");
const { sendSummaryComment } = require("./features/sendSummaryComment");
const { showAnnotations } = require("./features/showAnnotations");
const {
  sendMetricsToBarecheck,
  getMetricsFromBaseBranch
} = require("./features/barecheckApi");

const { getCoverageFromFile } = require("./services/lcovFile");

const runFeatures = async (diff, comparePercentage, compareFileData) => {
  await sendSummaryComment(diff, comparePercentage, compareFileData);
  checkMinimumRatio(diff);
  await showAnnotations(compareFileData);

  await sendMetricsToBarecheck(comparePercentage);
  core.setOutput("percentage", comparePercentage);
  core.setOutput("diff", diff);
};

const runCodeCoverage = async (coverage, baseFile) => {
  const baseMetrics = await getMetricsFromBaseBranch();
  let baseCoverage = baseMetrics ? baseMetrics.coverage : null;

  if (!baseCoverage) baseCoverage = await getCoverageFromFile(baseFile);

  core.info(`Base branch code coverage: ${baseCoverage}%`);

  const diff = (coverage - baseCoverage).toFixed(2);
  core.info(`Code coverage diff: ${diff}%`);

  await runFeatures(diff, coverage, baseCoverage);
};

async function main() {
  const compareFile = core.getInput("lcov-file");
  const baseFile = core.getInput("base-lcov-file");

  core.info(`lcov-file: ${compareFile}`);
  core.info(`base-lcov-file: ${baseFile}`);

  const coverage = getCoverageFromFile(compareFile);
  core.info(`Current code coverage: ${coverage}%`);

  await runCodeCoverage(coverage, baseFile);
}

try {
  main();
} catch (err) {
  core.info(err);
  core.setFailed(err.message);
}
