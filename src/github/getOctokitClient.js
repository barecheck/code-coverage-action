const getOctokitClient = () => {
  const githubToken = core.getInput('github-token');

  if (!githubToken) {
    throw new Error('github-token property is required');
  }

  const octokit = github.getOctokit(githubToken);

  return octokit;
};
