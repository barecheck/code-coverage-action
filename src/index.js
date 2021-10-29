const core = require("@actions/core");

const { checkMinimumRatio } = require("./features/minimumRatio");
const { sendSummaryComment } = require("./features/sendSummaryComment");
const { showAnnotations } = require("./features/showAnnotations");
const {
  sendMetricsToBarecheck,
  getMetricsFromBaseBranch
} = require("./features/barecheckApi");

const { getCoverageFromFile } = require("./services/lcovFile");

const runFeatures = async (diff, coverage) => {
  await sendSummaryComment(diff, coverage.percentage, coverage.data);
  checkMinimumRatio(diff);
  await showAnnotations(coverage.data);

  await sendMetricsToBarecheck(coverage.percentage);
  core.setOutput("percentage", coverage.percentage);
  core.setOutput("diff", diff);
};

const runCodeCoverage = async (coverage, baseFile) => {
  const baseMetrics = await getMetricsFromBaseBranch();
  let baseCoveragePercentage = baseMetrics ? baseMetrics.coverage : null;

  if (!baseCoveragePercentage) {
    const baseCoverage = await getCoverageFromFile(baseFile);
    baseCoveragePercentage = baseCoverage.percentage;
  }

  core.info(`Base branch code coverage: ${baseCoveragePercentage}%`);

  const diff = (coverage.percentage - baseCoveragePercentage).toFixed(2);
  core.info(`Code coverage diff: ${diff}%`);

  await runFeatures(diff, coverage);
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
