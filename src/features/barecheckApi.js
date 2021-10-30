const github = require("@actions/github");

const {
  setProjectMetric,
  getProjectMetric
} = require("../services/barecheckApi");
const { getBarecheckApiKey } = require("../input");

const getMetricsFromBaseBranch = async () => {
  const { ref, sha } = github.context.payload.pull_request.base;

  const apiKey = getBarecheckApiKey();

  const metrics = await getProjectMetric(apiKey, ref, sha);

  return metrics;
};

const sendMetricsToBarecheck = async (coverage) => {
  const { ref, sha } = github.context.payload.pull_request.head;

  const apiKey = getBarecheckApiKey();

  const { projectMetricId } = await setProjectMetric(
    apiKey,
    ref,
    sha,
    parseFloat(coverage)
  );

  return projectMetricId;
};

module.exports = {
  sendMetricsToBarecheck,
  getMetricsFromBaseBranch
};
