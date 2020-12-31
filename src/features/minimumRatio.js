const core = require('@actions/core');

const checkMinimumRatio = (coverageDiff) => {
  const minCoverageRatio = parseInt(core.getInput('minimum-ratio'), 10);

  core.info(`minimum-ratio: ${minCoverageRatio}`);

  if (minCoverageRatio >= 0) {
    core.info(`minimum-ratio is enabled for this workflow`);
    const coverageDiffAlert = coverageDiff + minCoverageRatio;

    if (coverageDiffAlert < 0) {
      core.setFailed('Code coverage is less than minimum code coverage ratio');
    }
  } else core.info(`minimum-ratio is disabled for this workflow`);
};

module.exports = {
  checkMinimumRatio
};
