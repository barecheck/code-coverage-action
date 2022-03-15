const core = require("@actions/core");

const { parseLcovFile } = require("barecheck");

const { getLcovFile, getBaseLcovFile } = require("./input");

// const runFeatures = async (diff, coverage) => {
//   await sendSummaryComment(diff, coverage.percentage, coverage.data);
//   checkMinimumRatio(diff);
//   await showAnnotations(coverage.data);

//   if (getBarecheckApiKey()) {
//     await sendMetricsToBarecheck(coverage.percentage);
//   }

//   core.setOutput("percentage", coverage.percentage);
//   core.setOutput("diff", diff);
// };

// TODO: move to `coverage` service to define priorities from
// where metrics should be calculated
// const runCodeCoverage = async (coverage, baseFile) => {
//   const baseMetrics = getBarecheckApiKey() ? await getBaseMetric() : false;
//   let baseCoveragePercentage = baseMetrics ? baseMetrics.coverage : 0;

//   if (!baseCoveragePercentage && baseFile) {
//     const baseCoverage = await getCoverageFromFile(baseFile);
//     baseCoveragePercentage = baseCoverage.percentage;
//   }

//   core.info(`Base branch code coverage: ${baseCoveragePercentage}%`);

//   const diff = (coverage.percentage - baseCoveragePercentage).toFixed(2);
//   core.info(`Code coverage diff: ${diff}%`);

//   await runFeatures(diff, coverage);
// };

async function main() {
  process.env.BARECHECK_API_URL = "https://barecheck.vercel.app/api/graphql";

  const compareFile = getLcovFile();
  const baseFile = getBaseLcovFile();

  core.info(`lcov-file: ${compareFile}`);
  core.info(`base-lcov-file: ${baseFile}`);

  const coverage = await parseLcovFile(compareFile);
  core.info(`Current code coverage: ${coverage.percentage}%`);
  core.info(`Current code coverage: ${coverage.data}%`);

  // await runCodeCoverage(coverage, baseFile);
}

try {
  main();
} catch (err) {
  core.info(err);
  core.setFailed(err.message);
}
