const core = require("@actions/core");
const { barecheckApi } = require("barecheck");

const { getBaseRefSha } = require("./github");
const { getBarecheckApiKey } = require("../input");

const getBaseBranchCoverage = async () => {
  const { ref, sha } = getBaseRefSha();
  // # if for some reason base ref, sha cannot be defined just skip comparision part
  if (!ref || !sha) {
    return null;
  }

  const apiKey = getBarecheckApiKey();

  core.info(`Getting metrics from Barecheck. ref=${ref}, sha=${sha}`);
  const { project, accessToken } = await barecheckApi.authProject({
    apiKey
  });

  const coverageMetrics = barecheckApi.coverageMetrics(accessToken, {
    projectId: project.id,
    ref,
    sha,
    take: 1
  });

  // eslint-disable-next-line no-console
  console.log(coverageMetrics);

  return coverageMetrics;
};

module.exports = {
  getBaseBranchCoverage
};
