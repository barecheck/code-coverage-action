const github = require("@actions/github");

const {
  setProjectMetric,
  getProjectMetric
} = require("../services/barecheckApi");
const { getBarecheckApiKey } = require("../input");

const cleanRef = (fullRef) =>
  fullRef ? fullRef.replace("refs/heads/", "") : null;

const getBaseMetric = async () => {
  const {
    before: baseSha,
    base_ref: baseRef,
    ref: currentRef,
    pull_request: pullRequest
  } = github.context.payload;

  const ref = cleanRef(baseRef || currentRef);

  const sha = pullRequest ? pullRequest.base.sha : baseSha;

  // # if for some reason base ref, sha cannot be defined just skip comparision part
  if (!ref || !sha) {
    return null;
  }

  const apiKey = getBarecheckApiKey();

  const metrics = await getProjectMetric(apiKey, ref, sha);

  return metrics;
};

const sendMetricsToBarecheck = async (coverage) => {
  const { ref: fullRef, sha } = github.context.payload;

  const ref = cleanRef(fullRef);

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
  getBaseMetric
};
