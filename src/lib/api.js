const core = require("@actions/core");
const { barecheckApi } = require("barecheck");

const { getBaseRefSha, getCurrentRefSha } = require("./github");
const { getBarecheckApiKey } = require("../input");

let projectAuthState = false;

const authProject = async () => {
  if (!projectAuthState) {
    const apiKey = getBarecheckApiKey();

    const authProjectRes = await barecheckApi.authProject({
      apiKey
    });
    projectAuthState = {
      projectId: authProjectRes.project.id,
      accessToken: authProjectRes.accessToken
    };
  }

  return projectAuthState;
};

const cleanAuthProject = () => {
  projectAuthState = false;
};

const getBaseBranchCoverage = async () => {
  const { ref, sha } = getBaseRefSha();
  // # if for some reason base ref, sha cannot be defined just skip comparision part
  if (!ref || !sha) {
    return null;
  }

  core.info(`Getting metrics from Barecheck. ref=${ref}, sha=${sha}`);

  const { projectId, accessToken } = await authProject();

  const coverageMetrics = await barecheckApi.coverageMetrics(accessToken, {
    projectId,
    ref,
    sha,
    take: 1
  });

  return coverageMetrics[0] ? coverageMetrics[0].totalCoverage : false;
};

const sendCurrentCoverage = async (totalCoverage) => {
  const { ref, sha } = getCurrentRefSha();

  core.info(
    `Sending metrics to Barecheck. ref=${ref}, sha=${sha}, coverage=${totalCoverage}`
  );

  const { projectId, accessToken } = await authProject();

  await barecheckApi.createCoverageMetric(accessToken, {
    projectId,
    ref,
    sha,
    totalCoverage
  });
};

module.exports = {
  getBaseBranchCoverage,
  sendCurrentCoverage,
  cleanAuthProject
};
