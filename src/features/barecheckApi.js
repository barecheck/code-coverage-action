const github = require("@actions/github");

const { setProjectMetric } = require("../services/barecheckApi");
const { getBarecheckApiKey } = require("../input");

const sendMetricsToBarecheck = async (coverage) => {
  const branch = github.context.payload.pull_request.head.ref;
  const commit = github.context.payload.pull_request.head.sha;
  const apiKey = getBarecheckApiKey();

  const { projectMetricId } = await setProjectMetric(
    apiKey,
    branch,
    commit,
    coverage
  );

  return projectMetricId;
};

module.exports = {
  sendMetricsToBarecheck
};
