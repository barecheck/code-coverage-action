const core = require("@actions/core");

const { parseLcovFile, githubApi } = require("barecheck");

const { getLcovFile, getBaseLcovFile } = require("./input");
const { getPullRequestContext, getOctokit } = require("./lib/github");

const sendSummaryComment = require("./services/sendSummaryComment");
const showAnnotations = require("./services/showAnnotations");

const runFeatures = async (diff, coverage) => {
  const { repo, owner, pullNumber } = getPullRequestContext();
  const octokit = await getOctokit();

  const changedFiles = await githubApi.getChangedFiles(octokit, {
    repo,
    owner,
    pullNumber
  });

  const changedFilesNames = changedFiles.map(({ filename }) => filename);

  const changedData = coverage.data.filter((file) =>
    changedFilesNames.includes(file)
  );

  await sendSummaryComment(changedData, diff, coverage.percentage);

  // checkMinimumRatio(diff);
  await showAnnotations(changedData);

  // if (getBarecheckApiKey()) {
  //   await sendMetricsToBarecheck(coverage.percentage);
  // }

  core.setOutput("percentage", coverage.percentage);
  core.setOutput("diff", diff);
};

const runCodeCoverage = async (coverage) => {
  // const baseMetrics = getBarecheckApiKey() ? await getBaseMetric() : false;
  // let baseCoveragePercentage = baseMetrics ? baseMetrics.coverage : 0;

  // if (!baseCoveragePercentage && baseFile) {
  //   const baseCoverage = await getCoverageFromFile(baseFile);
  //   baseCoveragePercentage = baseCoverage.percentage;
  // }

  // core.info(`Base branch code coverage: ${baseCoveragePercentage}%`);

  // const diff = (coverage.percentage - baseCoveragePercentage).toFixed(2);
  const diff = 0;
  core.info(`Code coverage diff: ${diff}%`);

  await runFeatures(diff, coverage);
};

async function main() {
  const compareFile = getLcovFile();
  const baseFile = getBaseLcovFile();

  core.info(`lcov-file: ${compareFile}`);
  core.info(`base-lcov-file: ${baseFile}`);

  const coverage = await parseLcovFile(compareFile);
  core.info(`Current code coverage: ${coverage.percentage}%`);

  await runCodeCoverage(coverage, baseFile);
}

try {
  main();
} catch (err) {
  core.info(err);
  core.setFailed(err.message);
}
