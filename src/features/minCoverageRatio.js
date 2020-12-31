const core = require('@actions/core');

const checkCoverageRation = (coverageDiff) => {
  const minCoverageRatio =
    parseInt(core.getInput('minimum-coverage-ratio'), 10) || 0;

  console.log('minimum-coverage-ratio', minCoverageRatio);

  const coverageDiffAlert = coverageDiff + minCoverageRatio;

  if (coverageDiffAlert < 0) {
    throw new Error(`Your coverage is ${coverageDiffAlert}%`);
  }
};

module.exports = {
  checkCoverageRation
};
