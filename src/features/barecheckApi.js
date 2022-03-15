const github = require("@actions/github");
const core = require("@actions/core");

const {
  setProjectMetric,
  getProjectMetric
} = require("../services/barecheckApi");
const { getBarecheckApiKey } = require("../input");

const cleanRef = (fullRef) =>
  fullRef ? fullRef.replace("refs/heads/", "") : null;

const getBaseRefSha = () => {
  const { before: baseSha, pull_request: pullRequest } = github.context.payload;
  const { ref: currentRef } = github.context;

  const fullRef = pullRequest ? pullRequest.base.ref : currentRef;
  const ref = cleanRef(fullRef);

  const sha = pullRequest ? pullRequest.base.sha : baseSha;

  return { ref, sha };
};

const getBaseMetric = async () => {
  const apiKey = getBarecheckApiKey();

  const { ref, sha } = getBaseRefSha();
  // # if for some reason base ref, sha cannot be defined just skip comparision part
  if (!ref || !sha) {
    return null;
  }

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
