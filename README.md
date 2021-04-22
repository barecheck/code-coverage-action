# code-coverage-action

GitHub Action that generates coverage reports

![code coverage report](./docs/img/barecheck-comment.png)

## Usage

To integrate with this Github Action, you can just use following configuration in your already created workflow. As a result you will get Github Pull request comment with total code coverage

```yml
- name: Generate Code Coverage report
  id: code-coverage
  uses: barecheck/code-coverage-action@v0.1-beta.1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    lcov-file: "./coverage/lcov.info"
    send-summary-comment: true
```

## Arguments

All available input args described in `./action.yml`.

## Workflow Example

In order to compare your new changes report and base branch you are able to use Github artifacts as in the example below:

```yml
name: Code Coverage

on: [pull_request]

jobs:
  base_branch_cov:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.base_ref }}
      - name: Use Node.js 14.16.1
        uses: actions/setup-node@v1
        with:
          node-version: 14.16.1

      - name: Install dependencies
        run: yarn

      - name: Run test coverage
        run: yarn coverage

      - name: Upload code coverage for ref branch
        uses: actions/upload-artifact@v2
        with:
          name: ref-lcov.info
          path: ./coverage/lcov.info

  checks:
    runs-on: ubuntu-latest
    needs: base_branch_cov
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 14.16.1
        uses: actions/setup-node@v1
        with:
          node-version: 14.16.1

      - name: Download code coverage report from base branch
        uses: actions/download-artifact@v2
        with:
          name: ref-lcov.info

      - name: Install dependencies
        run: yarn

      - name: Run test coverage
        run: yarn coverage

      #  Compares two code coverage files and generates report as a comment
      - name: Generate Code Coverage report
        id: code-coverage
        uses: barecheck/code-coverage-action@v0.2.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          lcov-file: "./coverage/lcov.info"
          base-lcov-file: "./lcov.info"
          minimum-ratio: 0 # Fails Github action once code coverage is decreasing
          send-summary-comment: true
          show-anotations: "warning" # Possible options warning|error
```
