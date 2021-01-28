const github = require('@actions/github');

const buildTableRow = ({ file, lines }) => {
  const buildArrayLink = (lines) => `<a href="/">${lines.join('-')}</a>`;

  const buildLink = (line) => `<a href="/">${line} </a>`;

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
