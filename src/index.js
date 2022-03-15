const core = require("@actions/core");

const { parseLcovFile } = require("barecheck");

const { getLcovFile, getBaseLcovFile } = require("./input");

const sendSummaryComment = require("./services/sendSummaryComment");

const runFeatures = async (diff, coverage) => {
  await sendSummaryComment(coverage.data, coverage.percentage, coverage.data);
  // checkMinimumRatio(diff);
  // await showAnnotations(coverage.data);

  // if (getBarecheckApiKey()) {
  //   await sendMetricsToBarecheck(coverage.percentage);
  // }

  core.setOutput("percentage", coverage.percentage);
  core.setOutput("diff", diff);
};

const runCodeCoverage = async (coverage) => {
  // const baseMetrics = getBarecheckApiKey() ? await getBaseMetric() : false;
  // let baseCoveragePercentage = baseMetrics ? baseMetrics.coverage : 0;

  // if (!baseCoveragePercentage && baseFile) {
  //   const baseCoverage = await getCoverageFromFile(baseFile);
  //   baseCoveragePercentage = baseCoverage.percentage;
  // }

  // core.info(`Base branch code coverage: ${baseCoveragePercentage}%`);

  // const diff = (coverage.percentage - baseCoveragePercentage).toFixed(2);
  const diff = 0;
  core.info(`Code coverage diff: ${diff}%`);

  await runFeatures(diff, coverage);
};

async function main() {
  process.env.BARECHECK_API_URL = "https://barecheck.vercel.app/api/graphql";

  const compareFile = getLcovFile();
  const baseFile = getBaseLcovFile();

  core.info(`lcov-file: ${compareFile}`);
  core.info(`base-lcov-file: ${baseFile}`);

  const coverage = await parseLcovFile(compareFile);
  core.info(`Current code coverage: ${coverage.percentage}%`);
  core.info(`Current code coverage: ${coverage.data}%`);

  await runCodeCoverage(coverage, baseFile);
}

try {
  main();
} catch (err) {
  core.info(err);
  core.setFailed(err.message);
}
