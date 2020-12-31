const core = require('@actions/core');

const checkCoverageRation = (coverageDiff) => {
  const minCoverageRatio = parseInt(
    core.getInput('minimum-coverage-ratio'),
    10
  );

  core.info(`minimum-coverage-ratio: ${minCoverageRatio}`);

  if (minCoverageRatio >= 0) {
    core.info(`minimum-coverage-ratio is enabled for this workflow`);
    const coverageDiffAlert = coverageDiff + minCoverageRatio;

    if (coverageDiffAlert < 0) {
      throw new Error('Code coverage is less than minimum code coverage ratio');
    }
  } else core.info(`minimum-coverage-ratio is disabled for this workflow`);
};

module.exports = {
  checkCoverageRation
};
