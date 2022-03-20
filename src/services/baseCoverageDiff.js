const core = require("@actions/core");
const { parseLcovFile } = require("barecheck");

const { getBaseLcovFile } = require("../input");

// eslint-disable-next-line max-statements
const getBasecoverageDiff = async (coverage) => {
  // TODO: Get metrics from Barecheck API
  const baseFile = getBaseLcovFile();
  const baseMetrics = false;
  let baseCoveragePercentage = baseMetrics ? baseMetrics.coverage : 0;

  if (!baseCoveragePercentage && baseFile) {
    core.info(`base-lcov-file: ${baseFile}`);
    const baseCoverage = await parseLcovFile(baseFile);
    baseCoveragePercentage = baseCoverage.percentage;
  }

  const diff = (coverage.percentage - baseCoveragePercentage).toFixed(2);

  core.info(`Base branch code coverage: ${baseCoveragePercentage}%`);
  core.info(`Code coverage diff: ${diff}%`);

  return diff;
};

module.exports = getBasecoverageDiff;
