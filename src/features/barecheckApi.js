/* eslint-disable max-statements */
const github = require("@actions/github");
const core = require("@actions/core");

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

  // eslint-disable-next-line no-console
  console.log(baseRef, currentRef, github.context);
  const ref = cleanRef(baseRef || currentRef);

  const sha = pullRequest ? pullRequest.base.sha : baseSha;

  // eslint-disable-next-line no-console
  console.log(sha, ref);

  // # if for some reason base ref, sha cannot be defined just skip comparision part
  if (!ref || !sha) {
    return null;
  }

  const apiKey = getBarecheckApiKey();

  core.info(`Getting metrics from Barecheck. ref=${ref}, sha=${sha}`);
  const metrics = await getProjectMetric(apiKey, ref, sha);

  return metrics;
};

const sendMetricsToBarecheck = async (coverage) => {
  const { ref: fullRef, sha } = github.context;

  const ref = cleanRef(fullRef);

  const apiKey = getBarecheckApiKey();

  core.info(
    `Sending metrics to Barecheck. ref=${ref}, sha=${sha}, coverage=${coverage}`
  );
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
