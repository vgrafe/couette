//@ts-check

import { markdownTable } from "markdown-table";

const getPercent = (summaryRow: any) => {
  const total =
    summaryRow.lines.total +
    summaryRow.statements.total +
    summaryRow.branches.total +
    summaryRow.functions.total;

  const covered =
    summaryRow.lines.covered +
    summaryRow.statements.covered +
    summaryRow.branches.covered +
    summaryRow.functions.covered;

  return covered / total;
};

const roundWithOneDigit = (num: number) => Math.round(num * 1000) / 10;

const addPlusIfPositive = (num: number) => (num > 0 ? "+" + num : num);

const getIcon = (num: number) =>
  roundWithOneDigit(num) < 70
    ? "🔴"
    : roundWithOneDigit(num) < 80
    ? "🟠"
    : "🟢";

export const summaryToTable = (summary: any) => {
  const [_, ...summaryRows] = Object.keys(summary);

  const summaryTable = markdownTable(
    [
      ["", "total", "coverage"],
      ...["lines", "statements", "branches", "functions"].map((field) => [
        getIcon(summary.total[field].total),
        field,
        roundWithOneDigit(summary.total[field].total) + "%",
      ]),
    ],
    { align: ["l", "l", "r"] }
  );

  const componentsTable = markdownTable(
    [
      ["", "module", "coverage"],
      ...summaryRows.map((row) => [
        getIcon(getPercent(summary[row])),
        row.replace(process.cwd(), ""),
        roundWithOneDigit(getPercent(summary[row])) + "%",
      ]),
    ],
    { align: ["l", "l", "r"] }
  );

  return { summaryTable, componentsTable };
};

export const summariesToTable = (summary: any, baseSummary: any) => {
  const [_, ...summaryRows] = Object.keys(summary);

  const summaryTable = markdownTable(
    [
      ["", "total", "coverage", "change"],
      ...["lines", "statements", "branches", "functions"].map((field) => [
        getIcon(summary.total[field].pct),
        field,
        summary.total[field].pct + "%",
        addPlusIfPositive(
          summary.total[field].pct - baseSummary.total[field].pct
        ) + "%",
      ]),
    ],
    { align: ["l", "l", "r", "r"] }
  );

  const componentsTable = markdownTable(
    [
      ["", "module", "coverage", "change"],
      ...summaryRows.map((row) => [
        getIcon(getPercent(summary[row])),
        row.replace(process.cwd(), ""),
        roundWithOneDigit(getPercent(summary[row])) + "%",
        addPlusIfPositive(
          roundWithOneDigit(
            getPercent(summary[row]) - getPercent(baseSummary[row])
          )
        ) + "%",
      ]),
    ],
    { align: ["l", "l", "r", "r"] }
  );

  return { summaryTable, componentsTable };
};
