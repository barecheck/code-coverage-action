const buildTableRow = ({ file, lines, github }) => {
  const getChangesLink = (lines) => `${github.blob_url}${lines}`;
  // TODO: find a way to get diff patch
  // `https://github.com/${owner}/${repo}/pull/${pullRequestNumber}/files#diff-${sha}${lines}`;

  const buildArrayLink = (lines) =>
    `<a href="${getChangesLink(`#L${lines[0]}-L${lines[1]}`)}">${lines.join('-')}</a>`;

  const buildLink = (line) =>
    `<a href="${getChangesLink(`#L${line}`)}">${line}</a>`;

  const buildUncoveredLines = (line) =>
    Array.isArray(line) ? buildArrayLink(line) : buildLink(line);

  const formattedlines = lines.map(buildUncoveredLines).join(', ');
  const formattedFile = `<a href="${getChangesLink('')}">${file}</a>`;

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
