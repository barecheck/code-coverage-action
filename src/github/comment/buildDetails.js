const github = require('@actions/github');

const buildTableRow = ({ file, lines, github }) => {
  console.log(github.context.payload);
  console.log(github.context);

  const repo = github.context.repo.repo;
  const owner = github.context.repo.owner;
  const pullRequestNumber = github.context.payload.pull_request.number;

  const getChangesLink = (lines) => `${github.blob_url}${lines}`;
  // const getChangesLink = (lines) =>
  // `https://github.com/${owner}/${repo}/pull/${pullRequestNumber}/files#diff-${sha}${lines}`;

  const buildArrayLink = (lines) =>
    `<a href="${getChangesLink(`R${lines[0]}-R${lines[1]}`)}">
    ${lines.join('-')}
    </a>`;

  const buildLink = (line) =>
    `<a href="${getChangesLink(`R${line}`)}">${line}</a>`;

  const buildUncoveredLines = (line) =>
    Array.isArray(line) ? buildArrayLink(line) : buildLink(line);

  const formattedlines = lines.map(buildUncoveredLines).join(', ');
  const formattedFile = `<a href="/">${file} </a>`;

  return `<tr><td>${formattedFile}</td><td>${formattedlines}</td></tr>`;
};

const buildDetails = (fileLines) => {
  const summary = '<summary>Coverage Report</summary>';

  const tableHeader = '<tr><th>File</th><th>Uncovered Lines</th></tr>';
  const tableBody = fileLines.map(buildTableRow).join('');
  const table = `<table><tbody>${tableHeader}${tableBody}</tbody></table>`;

  return `<details>${summary}${table}</details>`;
};

module.exports = buildDetails;
