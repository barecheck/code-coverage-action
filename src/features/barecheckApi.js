const github = require("@actions/github");

const {
  setProjectMetric,
  getProjectMetric
} = require("../services/barecheckApi");
const { getBarecheckApiKey } = require("../input");

const getMetricsFromBaseBranch = async () => {
  const branch = github.context.payload.pull_request.base.ref;
  const commit = github.context.payload.pull_request.base.sha;
  const apiKey = getBarecheckApiKey();

  const metrics = await getProjectMetric(apiKey, branch, commit);

  return metrics;
};

const sendMetricsToBarecheck = async (coverage) => {
  const branch = github.context.payload.pull_request.head.ref;
  const commit = github.context.payload.pull_request.head.sha;
  const apiKey = getBarecheckApiKey();

  const { projectMetricId } = await setProjectMetric(
    apiKey,
    branch,
    commit,
    parseFloat(coverage)
  );

  return projectMetricId;
};

module.exports = {
  sendMetricsToBarecheck,
  getMetricsFromBaseBranch
};
